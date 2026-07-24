import { type ComponentProps, type ElementType, type ReactNode, useId } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/base/field/default";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  type SelectRootProps,
  SelectTrigger,
  SelectValue,
} from "@/components/base/select";
import { cn } from "@/lib/utils";

type SelectFieldOption<TValue extends string = string> = {
  disabled?: boolean;
  icon?: ElementType;
  label: string;
  value: TValue;
};

type SelectFieldProps<TValue extends string = string> = Omit<
  SelectRootProps<TValue, false>,
  "children" | "items" | "multiple"
> & {
  contentProps?: Omit<ComponentProps<typeof SelectContent>, "children">;
  description?: ReactNode;
  descriptionProps?: Omit<ComponentProps<typeof FieldDescription>, "children" | "id">;
  error?: ReactNode;
  errorProps?: Omit<ComponentProps<typeof FieldError>, "children" | "id">;
  fieldProps?: Omit<ComponentProps<typeof Field>, "children">;
  isInvalid?: boolean;
  items: readonly SelectFieldOption<TValue>[];
  label: ReactNode;
  labelProps?: Omit<ComponentProps<typeof FieldLabel>, "children" | "htmlFor" | "id">;
  placeholder: ReactNode;
  triggerProps?: Omit<
    ComponentProps<typeof SelectTrigger>,
    "aria-errormessage" | "aria-invalid" | "children" | "id"
  >;
};

function SelectField<TValue extends string = string>({
  id,
  label,
  placeholder,
  items,
  description,
  error,
  isInvalid = false,
  disabled,
  fieldProps,
  labelProps,
  descriptionProps,
  errorProps,
  triggerProps,
  contentProps,
  ...selectProps
}: SelectFieldProps<TValue>) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const labelId = `${triggerId}-label`;
  const descriptionId = `${triggerId}-description`;
  const errorId = `${triggerId}-error`;
  const invalid = isInvalid || Boolean(error);
  const { className: fieldClassName, ...resolvedFieldProps } = fieldProps ?? {};
  const { className: labelClassName, ...resolvedLabelProps } = labelProps ?? {};
  const { className: descriptionClassName, ...resolvedDescriptionProps } = descriptionProps ?? {};
  const { className: errorClassName, ...resolvedErrorProps } = errorProps ?? {};
  const {
    className: triggerClassName,
    "aria-describedby": ariaDescribedBy,
    ...resolvedTriggerProps
  } = triggerProps ?? {};
  const { className: contentClassName, ...resolvedContentProps } = contentProps ?? {};
  const describedBy = [ariaDescribedBy, description ? descriptionId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <Field
      {...resolvedFieldProps}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      className={fieldClassName}
    >
      <FieldLabel {...resolvedLabelProps} id={labelId} className={labelClassName}>
        {label}
      </FieldLabel>

      <Select {...selectProps} items={items} disabled={disabled}>
        <SelectTrigger
          {...resolvedTriggerProps}
          id={triggerId}
          aria-labelledby={labelId}
          aria-describedby={describedBy || undefined}
          aria-errormessage={error ? errorId : undefined}
          aria-invalid={invalid || undefined}
          className={triggerClassName}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          {...resolvedContentProps}
          className={cn("tw:min-w-(--anchor-width)", contentClassName)}
        >
          <SelectGroup>
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                  {Icon ? <Icon aria-hidden="true" /> : null}
                  <span>{item.label}</span>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

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

export { SelectField, type SelectFieldOption, type SelectFieldProps };
