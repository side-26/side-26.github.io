import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ApiRouteError, apiError, parseJsonRequest } from "./route-handler.ts";

describe("API route errors", () => {
  it("returns one stable error contract with the request id in the body and headers", async () => {
    const response = apiError(
      new ApiRouteError(409, "CONFLICT", "The resource is already up to date.", {
        data: { resource: "profile" },
      }),
      { requestId: "request-123" },
    );

    assert.equal(response.status, 409);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-request-id"), "request-123");
    assert.deepEqual(await response.json(), {
      data: {
        code: "CONFLICT",
        resource: "profile",
      },
      id: "request-123",
      message: "The resource is already up to date.",
    });
  });

  it("maps schema validation issues to field names and deduplicated messages", async () => {
    const request = new Request("https://portfolio.example.com/api/example", {
      body: JSON.stringify({ email: "invalid" }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    await assert.rejects(
      parseJsonRequest(request, () => {
        throw {
          inner: [
            { message: "Enter a valid email.", path: "email" },
            { message: "Enter a valid email.", path: "email" },
            { message: "Email is required.", path: "email" },
          ],
        };
      }),
      (error: unknown) => {
        assert.ok(error instanceof ApiRouteError);
        assert.equal(error.status, 422);
        assert.equal(error.code, "VALIDATION_ERROR");
        assert.deepEqual(error.data, {
          messages: [
            {
              messages: ["Enter a valid email.", "Email is required."],
              name: "email",
            },
          ],
        });
        return true;
      },
    );
  });

  it("does not expose unknown server errors", async () => {
    const response = apiError(new Error("private database detail"), {
      requestId: "request-500",
    });

    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      data: { code: "INTERNAL_ERROR" },
      id: "request-500",
      message: "An unexpected server error occurred.",
    });
  });
});
