import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CONTACT_METHODS, createContactMessageHandler, type ContactMessageInput } from "./route.ts";

const API_KEY = "test-api-key-with-at-least-32-characters";
const REQUEST_ID = "request-contact-message-001";

const baseEnv: NodeJS.ProcessEnv = {
  CONTACT_EMAIL_WEBHOOK_URL: "https://automation.example.com/email",
  CONTACT_INSTAGRAM_WEBHOOK_URL: "https://automation.example.com/instagram",
  CONTACT_MESSAGE_API_KEY: API_KEY,
  CONTACT_MESSAGE_WEBHOOK_TOKEN: "provider-secret",
  CONTACT_PHONE_WEBHOOK_URL: "https://automation.example.com/phone",
  CONTACT_TELEGRAM_WEBHOOK_URL: "https://automation.example.com/telegram",
  NODE_ENV: "test",
};

const baseInput: ContactMessageInput = {
  contactMethod: "email",
  contactValue: "alex@example.com",
  fullName: "Alex Morgan",
  jobTitle: "Product lead",
  projectSummary:
    "We need a reliable customer portal with a focused onboarding flow and clear delivery plan.",
};

function createRequest(
  body: unknown = baseInput,
  options: {
    authorization?: string;
    contentType?: string;
  } = {},
) {
  return new Request("https://portfolio.example.com/api/contact/messages", {
    body: JSON.stringify(body),
    headers: {
      authorization: options.authorization ?? `Bearer ${API_KEY}`,
      "content-type": options.contentType ?? "application/json",
    },
    method: "POST",
  });
}

async function readJson(response: Response) {
  return (await response.json()) as {
    data?: {
      channel: string;
      messageId: string;
      status: string;
    };
    error?: {
      code: string;
      message: string;
      requestId: string;
    };
  };
}

function createHandler(
  options: {
    env?: NodeJS.ProcessEnv;
    fetch?: typeof fetch;
  } = {},
) {
  return createContactMessageHandler({
    createRequestId: () => REQUEST_ID,
    env: options.env ?? baseEnv,
    fetch:
      options.fetch ??
      (async () => {
        return new Response(null, { status: 204 });
      }),
  });
}

describe("POST /api/contact/messages", () => {
  it("rejects unauthenticated requests without calling a webhook", async () => {
    let webhookCalls = 0;
    const handler = createHandler({
      fetch: async () => {
        webhookCalls += 1;
        return new Response(null, { status: 204 });
      },
    });

    const response = await handler(createRequest(baseInput, { authorization: "Bearer wrong" }));
    const payload = await readJson(response);

    assert.equal(response.status, 401);
    assert.equal(payload.error?.code, "UNAUTHORIZED");
    assert.equal(payload.error?.requestId, REQUEST_ID);
    assert.equal(webhookCalls, 0);
  });

  it("requires a JSON content type", async () => {
    const response = await createHandler()(createRequest(baseInput, { contentType: "text/plain" }));
    const payload = await readJson(response);

    assert.equal(response.status, 415);
    assert.equal(payload.error?.code, "UNSUPPORTED_MEDIA_TYPE");
  });

  it("validates the contact value against the selected channel", async () => {
    const response = await createHandler()(
      createRequest({
        ...baseInput,
        contactMethod: "telegram",
        contactValue: "https://instagram.com/not-telegram",
      }),
    );
    const payload = await readJson(response);

    assert.equal(response.status, 422);
    assert.equal(payload.error?.code, "VALIDATION_ERROR");
  });

  it("rejects oversized request bodies before dispatch", async () => {
    const response = await createHandler()(
      createRequest({
        ...baseInput,
        projectSummary: "x".repeat(17 * 1024),
      }),
    );
    const payload = await readJson(response);

    assert.equal(response.status, 413);
    assert.equal(payload.error?.code, "PAYLOAD_TOO_LARGE");
  });

  for (const contactMethod of CONTACT_METHODS) {
    it(`dispatches ${contactMethod} messages only to its configured webhook`, async () => {
      const calls: Array<{ init?: RequestInit; url: string }> = [];
      const contactValues = {
        email: "alex@example.com",
        phoneNumber: "+1 555 123 4567",
        telegram: "https://t.me/alexmorgan",
        instagram: "https://instagram.com/alexmorgan",
      } satisfies Record<(typeof CONTACT_METHODS)[number], string>;
      const webhookUrls = {
        email: baseEnv.CONTACT_EMAIL_WEBHOOK_URL,
        phoneNumber: baseEnv.CONTACT_PHONE_WEBHOOK_URL,
        telegram: baseEnv.CONTACT_TELEGRAM_WEBHOOK_URL,
        instagram: baseEnv.CONTACT_INSTAGRAM_WEBHOOK_URL,
      } satisfies Record<(typeof CONTACT_METHODS)[number], string | undefined>;
      const handler = createHandler({
        fetch: async (input, init) => {
          calls.push({ init, url: String(input) });
          return new Response(null, { status: 204 });
        },
      });

      const response = await handler(
        createRequest({
          ...baseInput,
          contactMethod,
          contactValue: contactValues[contactMethod],
        }),
      );
      const payload = await readJson(response);
      const webhookPayload = JSON.parse(String(calls[0]?.init?.body)) as {
        channel: string;
        contact: { type: string; value: string };
        event: string;
        requestId: string;
      };
      const requestHeaders = new Headers(calls[0]?.init?.headers);

      assert.equal(response.status, 202);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(response.headers.get("x-request-id"), REQUEST_ID);
      assert.deepEqual(payload.data, {
        channel: contactMethod,
        messageId: REQUEST_ID,
        status: "accepted",
      });
      assert.equal(calls.length, 1);
      assert.equal(calls[0]?.url, webhookUrls[contactMethod]);
      assert.equal(calls[0]?.init?.method, "POST");
      assert.equal(calls[0]?.init?.redirect, "error");
      assert.equal(requestHeaders.get("authorization"), "Bearer provider-secret");
      assert.equal(requestHeaders.get("x-request-id"), REQUEST_ID);
      assert.equal(webhookPayload.channel, contactMethod);
      assert.equal(webhookPayload.contact.type, contactMethod);
      assert.equal(webhookPayload.contact.value, contactValues[contactMethod]);
      assert.equal(webhookPayload.event, "contact.message.created");
      assert.equal(webhookPayload.requestId, REQUEST_ID);
    });
  }

  it("returns a safe 503 response when the selected channel is not configured", async () => {
    const env = { ...baseEnv };
    delete env.CONTACT_INSTAGRAM_WEBHOOK_URL;
    const response = await createHandler({ env })(
      createRequest({
        ...baseInput,
        contactMethod: "instagram",
        contactValue: "https://instagram.com/alexmorgan",
      }),
    );
    const payload = await readJson(response);

    assert.equal(response.status, 503);
    assert.equal(payload.error?.code, "CHANNEL_UNAVAILABLE");
  });

  it("maps webhook failures to a safe delivery error", async () => {
    const response = await createHandler({
      fetch: async () =>
        Response.json(
          {
            internalProviderError: "must not be exposed",
          },
          { status: 500 },
        ),
    })(createRequest());
    const payload = await readJson(response);

    assert.equal(response.status, 502);
    assert.deepEqual(payload.error, {
      code: "DELIVERY_FAILED",
      message: "The message could not be delivered.",
      requestId: REQUEST_ID,
    });
    assert.equal(JSON.stringify(payload).includes("internalProviderError"), false);
  });

  it("maps network failures to a safe delivery error", async () => {
    const response = await createHandler({
      fetch: async () => {
        throw new Error("private network detail");
      },
    })(createRequest());
    const payload = await readJson(response);

    assert.equal(response.status, 502);
    assert.equal(payload.error?.code, "DELIVERY_FAILED");
    assert.equal(JSON.stringify(payload).includes("private network detail"), false);
  });
});
