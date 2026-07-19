import { type ComponentProps, type ReactNode, useId } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/base/field/default";
import { Input } from "@/components/base/input";
import { cn } from "@/lib/utils";

type TextFieldProps = Omit<ComponentProps<typeof Input>, "children"> & {
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

function TextField({
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
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const counterId = `${inputId}-counter`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
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
        data-slot="text-field-header"
        className="tw:flex tw:items-start tw:justify-between tw:gap-3"
      >
        <FieldLabel {...resolvedLabelProps} htmlFor={inputId} className={labelClassName}>
          {label}
        </FieldLabel>
        <FieldDescription
          {...resolvedCounterProps}
          id={counterId}
          aria-atomic="true"
          aria-live="polite"
          data-slot="text-field-counter"
          className={cn("tw:shrink-0 tw:text-end", counterClassName)}
        >
          {counter}
        </FieldDescription>
      </div>

      <Input
        {...inputProps}
        id={inputId}
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

export { TextField, type TextFieldProps };
