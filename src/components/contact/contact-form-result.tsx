import { CircleCheckBig, LoaderCircle, Send, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/base/alert";
import type { ContactMethod } from "@/entities/contact-message/contact-message.types";

type ContactFormResultProps =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; channel: ContactMethod }
  | { status: "error"; message: string };

const channelLabels: Record<ContactMethod, string> = {
  phoneNumber: "phone",
  telegram: "Telegram",
  email: "email",
  instagram: "Instagram",
};

export function ContactFormResult(props: ContactFormResultProps) {
  if (props.status === "sending") {
    return (
      <Alert role="status" aria-live="polite" aria-atomic="true" className="tw:backdrop-blur-none">
        <LoaderCircle className="tw:animate-spin tw:motion-reduce:animate-none" />
        <AlertTitle>Sending your project brief</AlertTitle>
        <AlertDescription>Keep this page open while the secure handoff completes.</AlertDescription>
      </Alert>
    );
  }

  if (props.status === "success") {
    return (
      <Alert
        variant="success"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="tw:backdrop-blur-none"
      >
        <CircleCheckBig />
        <AlertTitle>Project brief received</AlertTitle>
        <AlertDescription>
          I’ll review the details and reply by {channelLabels[props.channel]}.
        </AlertDescription>
      </Alert>
    );
  }

  if (props.status === "error") {
    return (
      <Alert
        variant="destructive"
        aria-live="assertive"
        aria-atomic="true"
        className="tw:backdrop-blur-none"
      >
        <TriangleAlert />
        <AlertTitle>Your brief wasn’t sent</AlertTitle>
        <AlertDescription>{props.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert role="status" aria-live="polite" aria-atomic="true" className="tw:backdrop-blur-none">
      <Send />
      <AlertTitle>Ready for the handoff</AlertTitle>
      <AlertDescription>
        Your details stay on this page until you choose Send project brief.
      </AlertDescription>
    </Alert>
  );
}
