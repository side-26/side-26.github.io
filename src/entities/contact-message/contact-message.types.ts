export const CONTACT_METHODS = ["phoneNumber", "telegram", "email", "instagram"] as const;

export type ContactMethod = (typeof CONTACT_METHODS)[number];

export type ContactMessageInput = {
  fullName: string;
  jobTitle: string;
  projectSummary: string;
  contactMethod: ContactMethod;
  contactValue: string;
};

export type ContactMessageResult = {
  channel: ContactMethod;
  messageId: string;
  status: "accepted";
};

export type ContactMessageResponse = {
  data: ContactMessageResult;
};
