"use client";

import { type ChangeEventHandler, type FocusEventHandler } from "react";
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form";

import { TextareaField, type TextareaFieldProps } from "@/components/base/field/textarea/base";

type FormTextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  TextareaFieldProps,
  | "aria-errormessage"
  | "aria-invalid"
  | "defaultValue"
  | "error"
  | "isInvalid"
  | "name"
  | "placeholder"
  | "ref"
  | "value"
> &
  Pick<UseControllerProps<TFieldValues, TName>, "defaultValue" | "rules" | "shouldUnregister"> & {
    name: TName;
    placeholder: string;
  };

function FormTextareaField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  placeholder,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  onBlur,
  onChange,
  ...textareaFieldProps
}: FormTextareaFieldProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const {
    field: {
      disabled: fieldDisabled,
      name: fieldName,
      onBlur: controllerOnBlur,
      onChange: controllerOnChange,
      ref: textareaRef,
      value: fieldValue,
    },
    fieldState,
  } = useController({
    control,
    name,
    defaultValue,
    disabled,
    rules,
    shouldUnregister,
  });
  const value = typeof fieldValue === "string" ? fieldValue : "";

  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (event) => {
    controllerOnBlur();
    onBlur?.(event);
  };

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    controllerOnChange(event);
    onChange?.(event);
  };

  return (
    <TextareaField
      {...textareaFieldProps}
      ref={textareaRef}
      name={fieldName}
      placeholder={placeholder}
      disabled={fieldDisabled}
      value={value}
      isInvalid={fieldState.invalid}
      error={fieldState.error?.message}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
}

export { FormTextareaField, type FormTextareaFieldProps };
