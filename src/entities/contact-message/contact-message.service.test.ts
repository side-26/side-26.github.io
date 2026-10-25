import assert from "node:assert/strict";
import test from "node:test";

import { ApiError } from "../../lib/api/errors.ts";
import type { ApiClient, ApiRequestOptions } from "../../lib/api/types.ts";
import { createContactMessageService } from "./contact-message.service.ts";
import type { ContactMessageInput, ContactMessageResponse } from "./contact-message.types.ts";

const input: ContactMessageInput = {
  fullName: "Ada Lovelace",
  jobTitle: "Product lead",
  projectSummary: "We need a reliable platform for coordinating our product launches.",
  contactMethod: "email",
  contactValue: "ada@example.com",
};

test("sends the contact message through the expected endpoint", async () => {
  const calls: Array<{ path: string; options?: ApiRequestOptions<ContactMessageInput> }> = [];
  const response: ContactMessageResponse = {
    data: {
      channel: "email",
      messageId: "message-123",
      status: "accepted",
    },
  };
  const api = {
    async post<TResponse, TBody>(path: string, options?: ApiRequestOptions<TBody>) {
      calls.push({
        path,
        options: options as ApiRequestOptions<ContactMessageInput>,
      });
      return response as TResponse;
    },
  } as ApiClient;

  const result = await createContactMessageService(api).send(input);

  assert.deepEqual(result, response.data);
  assert.deepEqual(calls, [
    {
      path: "/contact/message",
      options: {
        body: input,
        cache: "no-store",
        retry: 0,
      },
    },
  ]);
});

test("preserves request errors for the caller to present", async () => {
  const expectedError = new Error("network unavailable");
  const api = {
    async post() {
      throw expectedError;
    },
  } as unknown as ApiClient;

  await assert.rejects(
    createContactMessageService(api).send(input),
    (error: unknown) => error === expectedError,
  );
});

test("reports an unavailable delivery endpoint before making a request", async () => {
  const api = {
    async post() {
      throw new Error("The API client must not be called when delivery is unconfigured.");
    },
  } as unknown as ApiClient;

  await assert.rejects(createContactMessageService(api, false).send(input), (error: unknown) => {
    return error instanceof ApiError && error.code === "CONFIGURATION_ERROR";
  });
});
