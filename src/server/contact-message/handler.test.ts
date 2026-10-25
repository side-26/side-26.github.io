import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  ContactMessageMailer,
  GmailContactMessageMailerConfiguration,
} from "../../entities/contact-message/contact-message.mailer.ts";
import {
  CONTACT_METHODS,
  createContactMessageHandler,
  type ContactMessageInput,
} from "./handler.ts";

const API_KEY = "test-api-key-with-at-least-32-characters";
const REQUEST_ID = "request-contact-message-001";

const baseEnv: NodeJS.ProcessEnv = {
  CONTACT_MESSAGE_API_KEY: API_KEY,
  CONTACT_RECIPIENT_EMAIL: "mahdi@example.com",
  NODE_ENV: "test",
  SMTP_APP_PASSWORD: "abcd efgh ijkl mnop",
  SMTP_USER: "mahdi@gmail.com",
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
    origin?: string | null;
    secFetchSite?: string | null;
  } = {},
) {
  const headers = new Headers({
    "content-type": options.contentType ?? "application/json",
  });

  if (options.authorization) {
    headers.set("authorization", options.authorization);
  }

  if (options.origin !== null) {
    headers.set("origin", options.origin ?? "https://portfolio.example.com");
  }

  if (options.secFetchSite !== null) {
    headers.set("sec-fetch-site", options.secFetchSite ?? "same-origin");
  }

  return new Request("https://portfolio.example.com/api/contact/message", {
    body: JSON.stringify(body),
    headers,
    method: "POST",
  });
}

async function readJson(response: Response) {
  return (await response.json()) as {
    data?: {
      channel?: string;
      code?: string;
      messageId?: string;
      messages?: Array<{
        messages: string[];
        name: string;
      }>;
      status?: string;
    };
    id?: string;
    message?: string;
  };
}

function createHandler(
  options: {
    createMailer?: (configuration: GmailContactMessageMailerConfiguration) => ContactMessageMailer;
    env?: NodeJS.ProcessEnv;
    mailer?: ContactMessageMailer;
    reportProviderError?: (failure: {
      providerCode: string;
      requestId: string;
      status: number;
    }) => void;
  } = {},
) {
  return createContactMessageHandler({
    createMailer: options.createMailer,
    createRequestId: () => REQUEST_ID,
    env: options.env ?? baseEnv,
    mailer:
      options.mailer ??
      ({
        async send() {},
      } satisfies ContactMessageMailer),
    reportProviderError: options.reportProviderError ?? (() => {}),
  });
}

describe("POST /api/contact/message", () => {
  it("rejects cross-origin browser requests without sending an email", async () => {
    let deliveryCalls = 0;
    const handler = createHandler({
      mailer: {
        async send() {
          deliveryCalls += 1;
        },
      },
    });

    const response = await handler(
      createRequest(baseInput, {
        origin: "https://untrusted.example.com",
        secFetchSite: "cross-site",
      }),
    );
    const payload = await readJson(response);

    assert.equal(response.status, 403);
    assert.equal(payload.data?.code, "FORBIDDEN");
    assert.equal(payload.id, REQUEST_ID);
    assert.equal(deliveryCalls, 0);
  });

  it("accepts a trusted bearer request without browser origin headers", async () => {
    const response = await createHandler()(
      createRequest(baseInput, {
        authorization: `Bearer ${API_KEY}`,
        origin: null,
        secFetchSite: null,
      }),
    );
    const payload = await readJson(response);

    assert.equal(response.status, 202);
    assert.equal(payload.data?.status, "accepted");
  });

  it("requires a JSON content type", async () => {
    const response = await createHandler()(createRequest(baseInput, { contentType: "text/plain" }));
    const payload = await readJson(response);

    assert.equal(response.status, 415);
    assert.equal(payload.data?.code, "UNSUPPORTED_MEDIA_TYPE");
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
    assert.equal(payload.data?.code, "VALIDATION_ERROR");
    assert.deepEqual(payload.data?.messages, [
      {
        messages: ["Use a full Telegram profile URL, such as https://t.me/username."],
        name: "contactValue",
      },
    ]);
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
    assert.equal(payload.data?.code, "PAYLOAD_TOO_LARGE");
  });

  for (const contactMethod of CONTACT_METHODS) {
    it(`delivers ${contactMethod} briefs only to the Gmail mailer`, async () => {
      const calls: Array<{ input: ContactMessageInput; requestId: string }> = [];
      const contactValues = {
        email: "alex@example.com",
        phoneNumber: "+1 555 123 4567",
        telegram: "https://t.me/alexmorgan",
        instagram: "https://instagram.com/alexmorgan",
      } satisfies Record<(typeof CONTACT_METHODS)[number], string>;
      const input = {
        ...baseInput,
        contactMethod,
        contactValue: contactValues[contactMethod],
      };
      const response = await createHandler({
        mailer: {
          async send(value, requestId) {
            calls.push({ input: value, requestId });
          },
        },
      })(createRequest(input));
      const payload = await readJson(response);

      assert.equal(response.status, 202);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(response.headers.get("x-request-id"), REQUEST_ID);
      assert.deepEqual(payload.data, {
        channel: contactMethod,
        messageId: REQUEST_ID,
        status: "accepted",
      });
      assert.deepEqual(calls, [{ input, requestId: REQUEST_ID }]);
    });
  }

  it("normalizes the Gmail App Password before creating the mailer", async () => {
    const configurations: GmailContactMessageMailerConfiguration[] = [];
    const handler = createContactMessageHandler({
      createMailer(configuration) {
        configurations.push(configuration);

        return {
          async send() {},
        };
      },
      createRequestId: () => REQUEST_ID,
      env: baseEnv,
      reportProviderError() {},
    });

    const response = await handler(createRequest());

    assert.equal(response.status, 202);
    assert.deepEqual(configurations, [
      {
        appPassword: "abcdefghijklmnop",
        recipient: "mahdi@example.com",
        user: "mahdi@gmail.com",
      },
    ]);
  });

  for (const missingVariable of ["SMTP_USER", "SMTP_APP_PASSWORD"] as const) {
    it(`returns a safe 503 response when ${missingVariable} is missing`, async () => {
      const env = { ...baseEnv };
      delete env[missingVariable];
      const response = await createHandler({ env })(createRequest());
      const payload = await readJson(response);

      assert.equal(response.status, 503);
      assert.equal(payload.data?.code, "DELIVERY_UNAVAILABLE");
    });
  }

  it("classifies Gmail authentication failures without exposing SMTP details", async () => {
    const failures: Array<{
      providerCode: string;
      requestId: string;
      status: number;
    }> = [];
    const smtpError = Object.assign(new Error("private Gmail authentication detail"), {
      code: "EAUTH",
      responseCode: 535,
    });
    const response = await createHandler({
      mailer: {
        async send() {
          throw smtpError;
        },
      },
      reportProviderError: (failure) => failures.push(failure),
    })(createRequest());
    const payload = await readJson(response);

    assert.equal(response.status, 503);
    assert.deepEqual(payload, {
      data: {
        code: "DELIVERY_CONFIGURATION_ERROR",
      },
      id: REQUEST_ID,
      message: "Email delivery is not configured correctly.",
    });
    assert.deepEqual(failures, [
      {
        providerCode: "EAUTH",
        requestId: REQUEST_ID,
        status: 535,
      },
    ]);
    assert.equal(JSON.stringify(payload).includes("private Gmail authentication detail"), false);
  });

  it("classifies temporary SMTP connection failures", async () => {
    const response = await createHandler({
      mailer: {
        async send() {
          throw Object.assign(new Error("private socket detail"), {
            code: "ETIMEDOUT",
          });
        },
      },
    })(createRequest());
    const payload = await readJson(response);

    assert.equal(response.status, 503);
    assert.equal(payload.data?.code, "DELIVERY_TEMPORARILY_UNAVAILABLE");
    assert.equal(JSON.stringify(payload).includes("private socket detail"), false);
  });

  it("maps unknown SMTP failures to a safe delivery error", async () => {
    const response = await createHandler({
      mailer: {
        async send() {
          throw new Error("private SMTP detail");
        },
      },
    })(createRequest());
    const payload = await readJson(response);

    assert.equal(response.status, 502);
    assert.deepEqual(payload, {
      data: {
        code: "DELIVERY_FAILED",
      },
      id: REQUEST_ID,
      message: "The message could not be delivered.",
    });
    assert.equal(JSON.stringify(payload).includes("private SMTP detail"), false);
  });
});
