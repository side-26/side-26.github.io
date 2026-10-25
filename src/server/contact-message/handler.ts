import { createHash, timingSafeEqual } from "node:crypto";

import {
  ApiRouteError,
  apiError,
  apiSuccess,
  createRequestId as createApiRequestId,
  parseJsonRequest,
} from "../../lib/api/route-handler.ts";
import {
  createGmailContactMessageMailer,
  type ContactMessageMailer,
  type GmailContactMessageMailerConfiguration,
} from "../../entities/contact-message/contact-message.mailer.ts";
import { contactMessageSchema } from "../../entities/contact-message/contact-message.schema.ts";
import {
  CONTACT_METHODS,
  type ContactMessageInput,
  type ContactMessageResult,
} from "../../entities/contact-message/contact-message.types.ts";
import { siteConfig } from "../../lib/site.ts";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 16 * 1024;

type DeliveryProviderFailure = {
  providerCode: string;
  requestId: string;
  status: number;
};

type ContactMessageDependencies = {
  createRequestId?: () => string;
  createMailer?: (configuration: GmailContactMessageMailerConfiguration) => ContactMessageMailer;
  env?: NodeJS.ProcessEnv;
  mailer?: ContactMessageMailer;
  reportProviderError?: (failure: DeliveryProviderFailure) => void;
};

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

function isTrustedServerRequest(request: Request, env: NodeJS.ProcessEnv) {
  const configuredApiKey = env.CONTACT_MESSAGE_API_KEY;

  if (!configuredApiKey || configuredApiKey.length < 32) {
    return false;
  }

  const suppliedApiKey = getBearerToken(request);

  return Boolean(suppliedApiKey && safeEquals(suppliedApiKey, configuredApiKey));
}

function isSameOriginBrowserRequest(request: Request, env: NodeJS.ProcessEnv) {
  const suppliedOrigin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");

  if (!suppliedOrigin || (fetchSite && fetchSite !== "same-origin")) {
    return false;
  }

  try {
    const configuredOrigin = env.CONTACT_FORM_ALLOWED_ORIGIN;
    const expectedOrigin = new URL(configuredOrigin ?? request.url).origin;

    return new URL(suppliedOrigin).origin === expectedOrigin;
  } catch {
    return false;
  }
}

function authorizeRequest(request: Request, env: NodeJS.ProcessEnv) {
  if (!isTrustedServerRequest(request, env) && !isSameOriginBrowserRequest(request, env)) {
    throw new ApiRouteError(403, "FORBIDDEN", "The request origin could not be verified.");
  }
}

function getEmailConfiguration(env: NodeJS.ProcessEnv): GmailContactMessageMailerConfiguration {
  const user = env.SMTP_USER?.trim();
  const appPassword = env.SMTP_APP_PASSWORD?.replace(/\s+/g, "");

  if (!user || !appPassword) {
    throw new ApiRouteError(503, "DELIVERY_UNAVAILABLE", "Contact delivery is not configured.");
  }

  return {
    appPassword,
    recipient: env.CONTACT_RECIPIENT_EMAIL?.trim() || siteConfig.contactEmail,
    user,
  };
}

function getProviderCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    /^[A-Z][A-Z0-9_]{0,63}$/.test(error.code)
  ) {
    return error.code;
  }

  return "unknown";
}

function getProviderStatus(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "responseCode" in error &&
    typeof error.responseCode === "number"
  ) {
    return error.responseCode;
  }

  return 0;
}

function createDeliveryError(
  error: unknown,
  requestId: string,
  reportProviderError: (failure: DeliveryProviderFailure) => void,
) {
  const providerCode = getProviderCode(error);
  const status = getProviderStatus(error);

  reportProviderError({
    providerCode,
    requestId,
    status,
  });

  if (providerCode === "EAUTH" || status === 530 || status === 534 || status === 535) {
    return new ApiRouteError(
      503,
      "DELIVERY_CONFIGURATION_ERROR",
      "Email delivery is not configured correctly.",
    );
  }

  if (
    providerCode === "ECONNECTION" ||
    providerCode === "ESOCKET" ||
    providerCode === "ETIMEDOUT" ||
    status === 421 ||
    status === 450 ||
    status === 451 ||
    status === 452
  ) {
    return new ApiRouteError(
      503,
      "DELIVERY_TEMPORARILY_UNAVAILABLE",
      "Email delivery is temporarily unavailable.",
    );
  }

  return new ApiRouteError(502, "DELIVERY_FAILED", "The message could not be delivered.");
}

function createContactMessageHandler(dependencies: ContactMessageDependencies = {}) {
  const env = dependencies.env ?? process.env;
  const createRequestId = dependencies.createRequestId ?? createApiRequestId;
  const createMailer = dependencies.createMailer ?? createGmailContactMessageMailer;
  const reportProviderError =
    dependencies.reportProviderError ??
    ((failure: DeliveryProviderFailure) => {
      console.error("Contact message delivery failed.", failure);
    });
  let mailer = dependencies.mailer;

  return async function POST(request: Request) {
    const requestId = createRequestId();

    try {
      authorizeRequest(request, env);
      const input = await parseJsonRequest(
        request,
        (value) =>
          contactMessageSchema.validate(value, {
            abortEarly: false,
            stripUnknown: false,
          }),
        { maxBytes: MAX_REQUEST_BYTES },
      );
      const emailConfiguration = getEmailConfiguration(env);
      mailer ??= createMailer(emailConfiguration);

      try {
        await mailer.send(input, requestId);
      } catch (cause) {
        throw createDeliveryError(cause, requestId, reportProviderError);
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

export {
  CONTACT_METHODS,
  createContactMessageHandler,
  type ContactMessageInput,
  type ContactMessageResult,
};
