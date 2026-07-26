import nodemailer from "nodemailer";

import type { ContactMessageInput } from "./contact-message.types.ts";

type GmailContactMessageMailerConfiguration = {
  appPassword: string;
  recipient: string;
  user: string;
};

type MailTransportOptions = {
  auth: {
    pass: string;
    user: string;
  };
  connectionTimeout: number;
  greetingTimeout: number;
  service: "gmail";
  socketTimeout: number;
};

type ContactMailOptions = {
  from: string;
  headers: {
    "X-Request-ID": string;
  };
  replyTo?: string;
  subject: string;
  text: string;
  to: string;
};

type MailTransport = {
  sendMail(options: ContactMailOptions): Promise<unknown>;
};

type GmailContactMessageMailerDependencies = {
  createTransport?: (options: MailTransportOptions) => MailTransport;
};

type ContactMessageMailer = {
  send(input: ContactMessageInput, requestId: string): Promise<void>;
};

function sanitizeSubjectPart(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function createGmailContactMessageMailer(
  configuration: GmailContactMessageMailerConfiguration,
  dependencies: GmailContactMessageMailerDependencies = {},
): ContactMessageMailer {
  const createTransport =
    dependencies.createTransport ??
    ((options: MailTransportOptions) => nodemailer.createTransport(options));
  const transport = createTransport({
    auth: {
      pass: configuration.appPassword,
      user: configuration.user,
    },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    service: "gmail",
    socketTimeout: 10_000,
  });

  return {
    async send(input, requestId) {
      const replyTo = input.contactMethod === "email" ? input.contactValue : undefined;

      await transport.sendMail({
        from: `Portfolio contact <${configuration.user}>`,
        headers: {
          "X-Request-ID": requestId,
        },
        ...(replyTo ? { replyTo } : {}),
        subject: `New project brief from ${sanitizeSubjectPart(input.fullName)}`,
        text: [
          "A new project brief was submitted through your portfolio.",
          "",
          `Request ID: ${requestId}`,
          `Name: ${input.fullName}`,
          `Role: ${input.jobTitle}`,
          `Preferred reply method: ${input.contactMethod}`,
          `Contact detail: ${input.contactValue}`,
          "",
          "Project summary:",
          input.projectSummary,
        ].join("\n"),
        to: configuration.recipient,
      });
    },
  };
}

export {
  createGmailContactMessageMailer,
  type ContactMessageMailer,
  type GmailContactMessageMailerConfiguration,
  type GmailContactMessageMailerDependencies,
};
