import { type ComponentProps, type ReactNode, useId } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/base/field/default";
import { Textarea } from "@/components/base/textarea";
import { cn } from "@/lib/utils";

type TextareaFieldProps = Omit<ComponentProps<typeof Textarea>, "children"> & {
  label: ReactNode;
  counter: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  isInvalid?: boolean;
  fieldProps?: Omit<ComponentProps<typeof Field>, "children">;
  labelProps?: Omit<ComponentProps<typeof FieldLabel>, "children" | "htmlFor">;
  counterProps?: Omit<ComponentProps<typeof FieldDescription>, "children" | "id">;
  descriptionProps?: Omit<ComponentProps<typeof FieldDescription>, "children" | "id">;
  errorProps?: Omit<ComponentProps<typeof FieldError>, "children" | "id">;
};

function TextareaField({
  id,
  label,
  counter,
  description,
  error,
  isInvalid = false,
  disabled,
  fieldProps,
  labelProps,
  counterProps,
  descriptionProps,
  errorProps,
  "aria-describedby": ariaDescribedBy,
  "aria-errormessage": ariaErrorMessage,
  "aria-invalid": ariaInvalid,
  ...textareaProps
}: TextareaFieldProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const counterId = `${textareaId}-counter`;
  const descriptionId = `${textareaId}-description`;
  const errorId = `${textareaId}-error`;
  const invalidFromAria =
    ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false";
  const invalid = isInvalid || Boolean(error) || invalidFromAria;
  const describedBy = [ariaDescribedBy, counterId, description ? descriptionId : undefined]
    .filter(Boolean)
    .join(" ");
  const { className: fieldClassName, ...resolvedFieldProps } = fieldProps ?? {};
  const { className: labelClassName, ...resolvedLabelProps } = labelProps ?? {};
  const { className: counterClassName, ...resolvedCounterProps } = counterProps ?? {};
  const { className: descriptionClassName, ...resolvedDescriptionProps } = descriptionProps ?? {};
  const { className: errorClassName, ...resolvedErrorProps } = errorProps ?? {};

  return (
    <Field
      {...resolvedFieldProps}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      className={fieldClassName}
    >
      <div
        data-slot="textarea-field-header"
        className="tw:flex tw:items-start tw:justify-between tw:gap-3"
      >
        <FieldLabel {...resolvedLabelProps} htmlFor={textareaId} className={labelClassName}>
          {label}
        </FieldLabel>
        <FieldDescription
          {...resolvedCounterProps}
          id={counterId}
          aria-atomic="true"
          aria-live="polite"
          data-slot="textarea-field-counter"
          className={cn("tw:shrink-0 tw:text-end", counterClassName)}
        >
          {counter}
        </FieldDescription>
      </div>

      <Textarea
        {...textareaProps}
        id={textareaId}
        disabled={disabled}
        aria-describedby={describedBy || undefined}
        aria-errormessage={ariaErrorMessage ?? (error ? errorId : undefined)}
        aria-invalid={invalid || undefined}
      />

      {description ? (
        <FieldDescription
          {...resolvedDescriptionProps}
          id={descriptionId}
          className={descriptionClassName}
        >
          {description}
        </FieldDescription>
      ) : null}

      {error ? (
        <FieldError {...resolvedErrorProps} id={errorId} className={errorClassName}>
          {error}
        </FieldError>
      ) : null}
    </Field>
  );
}

export { TextareaField, type TextareaFieldProps };
