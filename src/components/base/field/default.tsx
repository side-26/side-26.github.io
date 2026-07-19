import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, type ReactNode } from "react";

import { Label } from "@/components/base/label";
import { Separator } from "@/components/base/separator";
import { cn } from "@/lib/utils";

function FieldSet({ className, ...props }: ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "tw:flex tw:flex-col tw:gap-6 tw:has-[>[data-slot=checkbox-group]]:gap-3 tw:has-[>[data-slot=radio-group]]:gap-3",
        className,
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "tw:mb-3 tw:font-medium tw:data-[variant=label]:text-sm tw:data-[variant=legend]:text-base",
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "tw:group/field-group tw:@container/field-group tw:flex tw:w-full tw:flex-col tw:gap-7 tw:data-[slot=checkbox-group]:gap-3 tw:*:data-[slot=field-group]:gap-4",
        className,
      )}
      {...props}
    />
  );
}

const fieldVariants = cva(
  "tw:group/field tw:flex tw:w-full tw:gap-3 tw:data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "tw:flex-col tw:*:w-full tw:[&>.sr-only]:w-auto",
        horizontal:
          "tw:flex-row tw:items-center tw:has-[>[data-slot=field-content]]:items-start tw:*:data-[slot=field-label]:flex-auto tw:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "tw:flex-col tw:*:w-full tw:@md/field-group:flex-row tw:@md/field-group:items-center tw:@md/field-group:*:w-auto tw:@md/field-group:has-[>[data-slot=field-content]]:items-start tw:@md/field-group:*:data-[slot=field-label]:flex-auto tw:[&>.sr-only]:w-auto tw:@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

function Field({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "tw:group/field-content tw:flex tw:flex-1 tw:flex-col tw:gap-1 tw:leading-snug",
        className,
      )}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "tw:group/field-label tw:peer/field-label tw:flex tw:w-fit tw:gap-2 tw:leading-snug tw:group-data-[disabled=true]/field:opacity-50 tw:has-data-checked:bg-input/30 tw:has-[>[data-slot=field]]:rounded-2xl tw:has-[>[data-slot=field]]:border tw:*:data-[slot=field]:p-4",
        "tw:has-[>[data-slot=field]]:w-full tw:has-[>[data-slot=field]]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "tw:flex tw:w-fit tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:group-data-[disabled=true]/field:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "tw:text-start tw:text-sm tw:leading-normal tw:font-normal tw:text-muted-foreground tw:group-has-data-horizontal/field:text-balance tw:[[data-variant=legend]+&]:-mt-1.5",
        "tw:last:mt-0 tw:nth-last-2:-mt-1",
        "tw:[&>a]:underline tw:[&>a]:underline-offset-4 tw:[&>a:hover]:text-primary",
        className,
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: ComponentProps<"div"> & {
  children?: ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={Boolean(children)}
      className={cn(
        "tw:relative tw:-my-2 tw:h-5 tw:text-sm tw:group-data-[variant=outline]/field-group:-mb-2",
        className,
      )}
      {...props}
    >
      <Separator className="tw:absolute tw:inset-0 tw:top-1/2" />
      {children ? (
        <span
          className="tw:relative tw:mx-auto tw:block tw:w-fit tw:bg-background tw:px-2 tw:text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      ) : null}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  let content = children;

  if (!content && errors?.length) {
    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors.length === 1) {
      content = uniqueErrors[0]?.message;
    } else {
      content = (
        <ul className="tw:ms-4 tw:flex tw:list-disc tw:flex-col tw:gap-1">
          {uniqueErrors.map((error) =>
            error?.message ? <li key={error.message}>{error.message}</li> : null,
          )}
        </ul>
      );
    }
  }

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("tw:text-sm tw:font-normal tw:text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
