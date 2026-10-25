import { ApiError } from "@/lib/api/errors";
import type { ApiClient } from "@/lib/api/types";

import type {
  ContactMessageInput,
  ContactMessageResponse,
  ContactMessageResult,
} from "./contact-message.types.ts";

export type ContactMessageService = {
  send(input: ContactMessageInput): Promise<ContactMessageResult>;
};

export function createContactMessageService(
  api: ApiClient,
  isConfigured = true,
): ContactMessageService {
  return {
    async send(input) {
      if (!isConfigured) {
        throw new ApiError("Contact delivery is not configured.", {
          code: "CONFIGURATION_ERROR",
        });
      }

      const response = await api.post<ContactMessageResponse, ContactMessageInput>(
        "/contact/message",
        {
          body: input,
          cache: "no-store",
          retry: 0,
        },
      );

      return response.data;
    },
  };
}
