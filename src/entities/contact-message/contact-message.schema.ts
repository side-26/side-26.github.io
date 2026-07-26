import { mixed, object, string, type ObjectSchema } from "yup";

import { CONTACT_METHODS, type ContactMessageInput } from "./contact-message.types.ts";

const phonePattern = /^\+?[0-9][0-9\s()-]{6,19}$/;
const telegramPattern = /^https:\/\/(?:t\.me|telegram\.me)\/[A-Za-z0-9_]{5,32}\/?$/;
const instagramPattern = /^https:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9._]{1,30}\/?$/;

export const contactMessageSchema: ObjectSchema<ContactMessageInput> = object({
  fullName: string()
    .trim()
    .required("Tell me your name so I know who I’m speaking with.")
    .min(2, "Your name should contain at least 2 characters.")
    .max(80, "Keep your name under 80 characters."),
  jobTitle: string()
    .trim()
    .required("Add your role or project title.")
    .min(2, "Your role should contain at least 2 characters.")
    .max(100, "Keep the title under 100 characters."),
  projectSummary: string()
    .trim()
    .required("Share a short summary of the project.")
    .min(40, "Share at least 40 characters so I have enough context.")
    .max(1_200, "Keep the project summary under 1,200 characters."),
  contactMethod: mixed<ContactMessageInput["contactMethod"]>()
    .oneOf(CONTACT_METHODS, "Choose a valid contact method.")
    .required("Choose how you’d like me to reply."),
  contactValue: string()
    .trim()
    .required("Add the contact detail I should use.")
    .max(320, "Keep your contact detail under 320 characters.")
    .when("contactMethod", ([contactMethod], schema) => {
      switch (contactMethod) {
        case "email":
          return schema.email("Enter a valid email address.");
        case "phoneNumber":
          return schema.matches(phonePattern, "Enter a valid phone number.");
        case "telegram":
          return schema.matches(
            telegramPattern,
            "Use a full Telegram profile URL, such as https://t.me/username.",
          );
        case "instagram":
          return schema.matches(
            instagramPattern,
            "Use a full Instagram profile URL, such as https://instagram.com/username.",
          );
        default:
          return schema;
      }
    }),
})
  .required()
  .noUnknown();
