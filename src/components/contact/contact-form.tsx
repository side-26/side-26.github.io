"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { AtSign, Mail, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

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
import { ContactFormResult } from "@/components/contact/contact-form-result";
import { contactMessageSchema } from "@/entities/contact-message/contact-message.schema";
import { createContactMessageService } from "@/entities/contact-message/contact-message.service";
import type {
  ContactMessageInput,
  ContactMethod,
} from "@/entities/contact-message/contact-message.types";
import { browserApi } from "@/lib/api/browser";

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
  },
] as const;

type ContactFormValues = ContactMessageInput;

type SubmissionResult =
  | { status: "idle" }
  | { status: "success"; channel: ContactMethod }
  | { status: "error"; message: string };

const contactMessageService = createContactMessageService(
  browserApi,
  Boolean(process.env.NEXT_PUBLIC_CONTACT_API_BASE_URL),
);

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
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult>({
    status: "idle",
  });

  async function handleSubmit(values: ContactFormValues) {
    setSubmissionResult({ status: "idle" });
    const result = await contactMessageService.send(values);
    setSubmissionResult({ status: "success", channel: result.channel });
  }

  return (
    <BaseForm<ContactFormValues>
      resolver={yupResolver(contactMessageSchema)}
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
      onSubmitError={(error) => {
        setSubmissionResult({ status: "error", message: error.message });
      }}
    >
      {({ formState }) => (
        <Card>
          <CardHeader>
            <CardTitle className="tw:text-xl tw:font-bold">Your project brief</CardTitle>
            <CardDescription className="tw:max-w-xl tw:leading-6">
              Give me enough context to make the first reply useful. I’ll send it securely and reply
              through the channel you choose.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactFields />
          </CardContent>
          <CardFooter className="tw:grid tw:items-center tw:gap-4 tw:border-t tw:border-border/60 tw:pt-5 tw:sm:grid-cols-[1fr_auto]">
            <ContactFormResult
              {...(formState.isSubmitting ? { status: "sending" as const } : submissionResult)}
            />
            <Button
              type="submit"
              size="lg"
              className="tw:w-full tw:sm:w-auto"
              isLoading={formState.isSubmitting}
              loadingText="Sending brief…"
            >
              Send project brief
              <Send data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </BaseForm>
  );
}

export { ContactForm };
