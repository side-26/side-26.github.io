import type { ApiClient } from "@/lib/api/types";

import type {
  ContactMessageInput,
  ContactMessageResponse,
  ContactMessageResult,
} from "./contact-message.types.ts";

export type ContactMessageService = {
  send(input: ContactMessageInput): Promise<ContactMessageResult>;
};

export function createContactMessageService(api: ApiClient): ContactMessageService {
  return {
    async send(input) {
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
