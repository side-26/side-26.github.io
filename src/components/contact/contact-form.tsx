"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { AtSign, Mail, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import * as yup from "yup";

import { Button } from "@/components/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/card";
import { FieldGroup } from "@/components/base/field/default";
import { FormSelectField } from "@/components/base/field/select/form-field";
import { FormTextField } from "@/components/base/field/text/form-field";
import { FormTextareaField } from "@/components/base/field/textarea/form-field";
import { BaseForm } from "@/components/base/form";
import { siteConfig } from "@/lib/site";

const contactMethods = [
  {
    value: "email",
    label: "Email",
    icon: Mail,
    detailLabel: "Email address",
    placeholder: "name@company.com",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    validationMessage: "Enter a valid email address.",
  },
  {
    value: "phoneNumber",
    label: "Phone number",
    icon: Phone,
    detailLabel: "Phone number",
    placeholder: "+1 555 123 4567",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    validationMessage: "Enter a valid phone number, including the country code.",
  },
  {
    value: "telegram",
    label: "Telegram",
    icon: Send,
    detailLabel: "Telegram profile",
    placeholder: "https://t.me/username",
    type: "url",
    inputMode: "url",
    autoComplete: "url",
    validationMessage: "Enter a full Telegram profile URL, such as https://t.me/username.",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: AtSign,
    detailLabel: "Instagram profile",
    placeholder: "https://instagram.com/username",
    type: "url",
    inputMode: "url",
    autoComplete: "url",
    validationMessage:
      "Enter a full Instagram profile URL, such as https://instagram.com/username.",
  },
] as const;

type ContactMethod = (typeof contactMethods)[number]["value"];

type ContactFormValues = {
  contactMethod: ContactMethod;
  contactValue: string;
  fullName: string;
  jobTitle: string;
  projectSummary: string;
};

const contactMethodValues = contactMethods.map((method) => method.value);

function isSupportedProfileUrl(value: string, hosts: readonly string[]) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");

    return url.protocol === "https:" && hosts.includes(hostname) && url.pathname.length > 1;
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

const contactSchema: yup.ObjectSchema<ContactFormValues> = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Enter your full name.")
    .min(2, "Your name should contain at least 2 characters.")
    .max(80, "Keep your name under 80 characters."),
  jobTitle: yup
    .string()
    .trim()
    .required("Tell me your role or job title.")
    .min(2, "Your role should contain at least 2 characters.")
    .max(100, "Keep your role under 100 characters."),
  projectSummary: yup
    .string()
    .trim()
    .required("Add a short summary of the project.")
    .min(40, "Share at least 40 characters so I have enough context.")
    .max(1200, "Keep the project summary under 1,200 characters."),
  contactMethod: yup
    .mixed<ContactMethod>()
    .oneOf(contactMethodValues)
    .required("Choose how you would like me to reply."),
  contactValue: yup
    .string()
    .trim()
    .required("Add the contact detail where I should reply.")
    .test("contact-format", function validateContactValue(value) {
      const method = (this.parent as ContactFormValues).contactMethod;
      const methodConfig = contactMethods.find((item) => item.value === method);

      if (!value || !methodConfig || isValidContactValue(value, method)) {
        return true;
      }

      return this.createError({ message: methodConfig.validationMessage });
    }),
});

function ContactFields() {
  const { clearErrors, control, setValue } = useFormContext<ContactFormValues>();
  const contactMethod = useWatch({ control, name: "contactMethod" });
  const methodConfig =
    contactMethods.find((method) => method.value === contactMethod) ?? contactMethods[0];

  return (
    <FieldGroup>
      <FieldGroup className="tw:grid tw:gap-5 tw:sm:grid-cols-2">
        <FormTextField<ContactFormValues>
          name="fullName"
          label="Full name"
          counter="Required"
          placeholder="Your full name"
          autoComplete="name"
          maxLength={80}
          required
        />
        <FormTextField<ContactFormValues>
          name="jobTitle"
          label="Your role"
          counter="Required"
          placeholder="Founder, product lead, engineering manager…"
          autoComplete="organization-title"
          maxLength={100}
          required
        />
      </FieldGroup>

      <FormTextareaField<ContactFormValues>
        name="projectSummary"
        label="Project summary"
        counter="40–1,200 characters"
        placeholder="What are you building, who is it for, and what needs to change?"
        description="A useful first brief covers the product, its audience, the current pressure, and the outcome you need."
        rows={7}
        minLength={40}
        maxLength={1200}
        required
      />

      <FieldGroup className="tw:grid tw:gap-5 tw:sm:grid-cols-2">
        <FormSelectField<ContactFormValues, "contactMethod", ContactMethod>
          name="contactMethod"
          label="Best way to reply"
          placeholder="Choose a contact method"
          description="Choose the channel you are most comfortable checking."
          items={contactMethods}
          required
          onValueChange={(nextMethod) => {
            if (nextMethod !== contactMethod) {
              setValue("contactValue", "", {
                shouldDirty: true,
                shouldTouch: false,
                shouldValidate: false,
              });
              clearErrors("contactValue");
            }
          }}
        />

        <FormTextField<ContactFormValues>
          key={methodConfig.value}
          name="contactValue"
          label={methodConfig.detailLabel}
          counter="Required"
          placeholder={methodConfig.placeholder}
          type={methodConfig.type}
          inputMode={methodConfig.inputMode}
          autoComplete={methodConfig.autoComplete}
          required
          fieldProps={{
            className:
              "tw:animate-in tw:fade-in-0 tw:slide-in-from-top-1 tw:duration-200 tw:motion-reduce:animate-none",
          }}
        />
      </FieldGroup>
    </FieldGroup>
  );
}

function ContactForm() {
  const [isDraftPrepared, setIsDraftPrepared] = useState(false);

  function handleSubmit(values: ContactFormValues) {
    const selectedMethod = contactMethods.find((method) => method.value === values.contactMethod);
    const subject = `Project inquiry from ${values.fullName}: ${values.jobTitle}`;
    const body = [
      "Hello Mahdi,",
      "",
      "I would like to discuss a project.",
      "",
      `Name: ${values.fullName}`,
      `Role: ${values.jobTitle}`,
      `Preferred reply method: ${selectedMethod?.label ?? values.contactMethod}`,
      `Contact detail: ${values.contactValue}`,
      "",
      "Project summary:",
      values.projectSummary,
    ].join("\n");
    const query = new URLSearchParams({ subject, body });

    setIsDraftPrepared(true);
    window.location.href = `mailto:${siteConfig.contactEmail}?${query.toString()}`;
  }

  return (
    <BaseForm<ContactFormValues>
      resolver={yupResolver(contactSchema)}
      formOptions={{
        defaultValues: {
          fullName: "",
          jobTitle: "",
          projectSummary: "",
          contactMethod: "email",
          contactValue: "",
        },
        mode: "onBlur",
        reValidateMode: "onChange",
      }}
      errorSummaryTitle="A few details need your attention"
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader>
          <CardTitle className="tw:text-xl tw:font-bold">Your project brief</CardTitle>
          <CardDescription className="tw:max-w-xl tw:leading-6">
            Give me enough context to make the first reply useful. Your email application will open
            with everything prepared for you to review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactFields />
        </CardContent>
        <CardFooter className="tw:flex-col tw:items-stretch tw:gap-3 tw:sm:flex-row tw:sm:items-center tw:sm:justify-between">
          <p role="status" aria-live="polite" className="tw:text-sm tw:text-muted-foreground">
            {isDraftPrepared
              ? "Your email draft is ready. Review it, then send when you are comfortable."
              : "Nothing is sent until you review the email draft."}
          </p>
          <Button type="submit" size="lg" className="tw:w-full tw:sm:w-auto">
            Open email draft
            <Send data-icon="inline-end" />
          </Button>
        </CardFooter>
      </Card>
    </BaseForm>
  );
}

export { ContactForm };
