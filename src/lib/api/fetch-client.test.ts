import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ApiError, getApiFieldMessages } from "./errors.ts";
import { createApiClient } from "./fetch-client.ts";

describe("API fetch error handling", () => {
  it("normalizes a structured API failure into ApiError", async () => {
    const api = createApiClient({
      baseUrl: "/api",
      fetch: async () =>
        Response.json(
          {
            data: {
              code: "VALIDATION_ERROR",
              messages: [
                {
                  messages: ["Enter a valid email address."],
                  name: "email",
                },
              ],
            },
            id: "request-validation-001",
            message: "The request payload is invalid.",
          },
          {
            headers: { "x-request-id": "request-validation-001" },
            status: 422,
          },
        ),
    });

    await assert.rejects(api.post("/example", { body: {} }), (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.message, "The request payload is invalid.");
      assert.equal(error.requestId, "request-validation-001");
      assert.equal(error.status, 422);
      assert.equal(error.data?.code, "VALIDATION_ERROR");
      assert.deepEqual(getApiFieldMessages(error), [
        {
          messages: ["Enter a valid email address."],
          name: "email",
        },
      ]);
      return true;
    });
  });

  it("uses a safe fallback for an unstructured HTTP failure", async () => {
    const api = createApiClient({
      baseUrl: "/api",
      fetch: async () =>
        new Response("private proxy detail", {
          headers: { "x-request-id": "request-proxy-001" },
          status: 502,
        }),
      retry: 0,
    });

    await assert.rejects(api.get("/example"), (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.message, "The server could not complete the request. Please try again.");
      assert.equal(error.requestId, "request-proxy-001");
      assert.equal(error.data, undefined);
      return true;
    });
  });
});
