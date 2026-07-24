import { createHash, timingSafeEqual } from "node:crypto";

import * as yup from "yup";

import {
  ApiRouteError,
  apiError,
  apiSuccess,
  createRequestId as createApiRequestId,
  parseJsonRequest,
} from "../../../../lib/api/route-handler.ts";

export const runtime = "nodejs";

const CONTACT_METHODS = ["email", "phoneNumber", "telegram", "instagram"] as const;
const MAX_REQUEST_BYTES = 16 * 1024;
const WEBHOOK_ENV_KEYS = {
  email: "CONTACT_EMAIL_WEBHOOK_URL",
  phoneNumber: "CONTACT_PHONE_WEBHOOK_URL",
  telegram: "CONTACT_TELEGRAM_WEBHOOK_URL",
  instagram: "CONTACT_INSTAGRAM_WEBHOOK_URL",
} as const satisfies Record<ContactMethod, keyof NodeJS.ProcessEnv>;

type ContactMethod = (typeof CONTACT_METHODS)[number];

type ContactMessageInput = {
  contactMethod: ContactMethod;
  contactValue: string;
  fullName: string;
  jobTitle: string;
  projectSummary: string;
};

type ContactMessageResult = {
  channel: ContactMethod;
  messageId: string;
  status: "accepted";
};

type ContactMessageWebhookPayload = {
  channel: ContactMethod;
  contact: {
    type: ContactMethod;
    value: string;
  };
  event: "contact.message.created";
  message: {
    text: string;
  };
  requestId: string;
  sender: {
    fullName: string;
    jobTitle: string;
  };
  version: 1;
};

type ContactMessageDependencies = {
  createRequestId?: () => string;
  env?: NodeJS.ProcessEnv;
  fetch?: typeof fetch;
};

function isSupportedProfileUrl(value: string, hosts: readonly string[]) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");

    return (
      url.protocol === "https:" &&
      hosts.includes(hostname) &&
      url.pathname.split("/").filter(Boolean).length === 1
    );
  } catch {
    return false;
  }
}

function isValidContactValue(value: string, method: ContactMethod) {
  switch (method) {
    case "email":
      return yup.string().email().isValidSync(value);
    case "phoneNumber":
      return /^\+?[0-9][0-9\s().-]{6,19}$/.test(value);
    case "telegram":
      return isSupportedProfileUrl(value, ["t.me", "telegram.me"]);
    case "instagram":
      return isSupportedProfileUrl(value, ["instagram.com"]);
  }
}

const contactMessageSchema: yup.ObjectSchema<ContactMessageInput> = yup
  .object({
    fullName: yup.string().trim().required().min(2).max(80),
    jobTitle: yup.string().trim().required().min(2).max(100),
    projectSummary: yup.string().trim().required().min(40).max(1200),
    contactMethod: yup.mixed<ContactMethod>().oneOf(CONTACT_METHODS).required(),
    contactValue: yup
      .string()
      .trim()
      .required()
      .max(320)
      .test("contact-format", function validateContactValue(value) {
        const method = (this.parent as ContactMessageInput).contactMethod;

        return Boolean(value && method && isValidContactValue(value, method));
      }),
  })
  .noUnknown();

function safeEquals(left: string, right: string) {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();

  return timingSafeEqual(leftDigest, rightDigest);
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorization.slice("Bearer ".length).trim();
}

function authenticateRequest(request: Request, env: NodeJS.ProcessEnv) {
  const configuredApiKey = env.CONTACT_MESSAGE_API_KEY;

  if (!configuredApiKey || configuredApiKey.length < 32) {
    throw new ApiRouteError(
      503,
      "SERVICE_UNAVAILABLE",
      "The contact message service is not configured.",
    );
  }

  const suppliedApiKey = getBearerToken(request);

  if (!suppliedApiKey || !safeEquals(suppliedApiKey, configuredApiKey)) {
    throw new ApiRouteError(401, "UNAUTHORIZED", "Authentication is required.");
  }
}

function getWebhookUrl(contactMethod: ContactMethod, env: NodeJS.ProcessEnv) {
  const value = env[WEBHOOK_ENV_KEYS[contactMethod]];

  if (!value) {
    throw new ApiRouteError(
      503,
      "CHANNEL_UNAVAILABLE",
      "The selected contact channel is not configured.",
    );
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch (cause) {
    throw new ApiRouteError(
      503,
      "CHANNEL_UNAVAILABLE",
      "The selected contact channel is not configured.",
      { cause },
    );
  }

  if (url.protocol !== "https:" || url.username || url.password) {
    throw new ApiRouteError(
      503,
      "CHANNEL_UNAVAILABLE",
      "The selected contact channel is not configured.",
    );
  }

  return url;
}

function createWebhookPayload(
  input: ContactMessageInput,
  requestId: string,
): ContactMessageWebhookPayload {
  return {
    channel: input.contactMethod,
    contact: {
      type: input.contactMethod,
      value: input.contactValue,
    },
    event: "contact.message.created",
    message: {
      text: input.projectSummary,
    },
    requestId,
    sender: {
      fullName: input.fullName,
      jobTitle: input.jobTitle,
    },
    version: 1,
  };
}

function createContactMessageHandler(dependencies: ContactMessageDependencies = {}) {
  const fetchImplementation = dependencies.fetch ?? fetch;
  const env = dependencies.env ?? process.env;
  const createRequestId = dependencies.createRequestId ?? createApiRequestId;

  return async function POST(request: Request) {
    const requestId = createRequestId();

    try {
      authenticateRequest(request, env);
      const input = await parseJsonRequest(
        request,
        (value) =>
          contactMessageSchema.validate(value, {
            abortEarly: false,
            stripUnknown: false,
          }),
        { maxBytes: MAX_REQUEST_BYTES },
      );
      const webhookUrl = getWebhookUrl(input.contactMethod, env);
      const headers = new Headers({
        "content-type": "application/json",
        "x-request-id": requestId,
      });
      const webhookToken = env.CONTACT_MESSAGE_WEBHOOK_TOKEN;

      if (webhookToken) {
        headers.set("authorization", `Bearer ${webhookToken}`);
      }

      let webhookResponse: Response;

      try {
        webhookResponse = await fetchImplementation(webhookUrl, {
          body: JSON.stringify(createWebhookPayload(input, requestId)),
          cache: "no-store",
          headers,
          method: "POST",
          redirect: "error",
          signal: AbortSignal.timeout(8_000),
        });
      } catch (cause) {
        throw new ApiRouteError(502, "DELIVERY_FAILED", "The message could not be delivered.", {
          cause,
        });
      }

      if (!webhookResponse.ok) {
        throw new ApiRouteError(502, "DELIVERY_FAILED", "The message could not be delivered.");
      }

      return apiSuccess<ContactMessageResult>(
        {
          channel: input.contactMethod,
          messageId: requestId,
          status: "accepted",
        },
        {
          headers: {
            "cache-control": "no-store",
            "x-request-id": requestId,
          },
          status: 202,
        },
      );
    } catch (error) {
      return apiError(error, { requestId });
    }
  };
}

const POST = createContactMessageHandler();

export {
  CONTACT_METHODS,
  POST,
  createContactMessageHandler,
  type ContactMessageInput,
  type ContactMessageResult,
};
