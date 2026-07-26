import assert from "node:assert/strict";
import test from "node:test";

import { createGmailContactMessageMailer } from "./contact-message.mailer.ts";
import type { ContactMessageInput } from "./contact-message.types.ts";

const baseInput: ContactMessageInput = {
  contactMethod: "email",
  contactValue: "alex@example.com",
  fullName: "Alex Morgan",
  jobTitle: "Product lead",
  projectSummary:
    "We need a reliable customer portal with a focused onboarding flow and clear delivery plan.",
};

test("configures Gmail SMTP and sends the complete project brief to the owner", async () => {
  const transportOptions: unknown[] = [];
  const mailOptions: unknown[] = [];
  const mailer = createGmailContactMessageMailer(
    {
      appPassword: "app-password",
      recipient: "mahdi@example.com",
      user: "mahdi@gmail.com",
    },
    {
      createTransport(options) {
        transportOptions.push(options);

        return {
          async sendMail(mail) {
            mailOptions.push(mail);
          },
        };
      },
    },
  );

  await mailer.send(baseInput, "request-001");

  assert.deepEqual(transportOptions, [
    {
      auth: {
        pass: "app-password",
        user: "mahdi@gmail.com",
      },
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      service: "gmail",
      socketTimeout: 10_000,
    },
  ]);
  assert.deepEqual(mailOptions, [
    {
      from: "Portfolio contact <mahdi@gmail.com>",
      headers: {
        "X-Request-ID": "request-001",
      },
      replyTo: "alex@example.com",
      subject: "New project brief from Alex Morgan",
      text: [
        "A new project brief was submitted through your portfolio.",
        "",
        "Request ID: request-001",
        "Name: Alex Morgan",
        "Role: Product lead",
        "Preferred reply method: email",
        "Contact detail: alex@example.com",
        "",
        "Project summary:",
        baseInput.projectSummary,
      ].join("\n"),
      to: "mahdi@example.com",
    },
  ]);
});

test("keeps non-email contact details in the brief without addressing the visitor", async () => {
  const mailOptions: Array<{ replyTo?: string; text: string; to: string }> = [];
  const mailer = createGmailContactMessageMailer(
    {
      appPassword: "app-password",
      recipient: "mahdi@example.com",
      user: "mahdi@gmail.com",
    },
    {
      createTransport() {
        return {
          async sendMail(mail) {
            mailOptions.push(mail);
          },
        };
      },
    },
  );

  await mailer.send(
    {
      ...baseInput,
      contactMethod: "telegram",
      contactValue: "https://t.me/alexmorgan",
    },
    "request-002",
  );

  assert.equal(mailOptions.length, 1);
  assert.equal(mailOptions[0]?.to, "mahdi@example.com");
  assert.equal(mailOptions[0]?.replyTo, undefined);
  assert.equal(mailOptions[0]?.text.includes("https://t.me/alexmorgan"), true);
});
