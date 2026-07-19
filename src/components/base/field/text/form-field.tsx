"use client";

import { type ChangeEventHandler, type FocusEventHandler } from "react";
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form";

import { TextField, type TextFieldProps } from "@/components/base/field/text/base";

type FormTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  TextFieldProps,
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

function FormTextField<
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
  ...textFieldProps
}: FormTextFieldProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const {
    field: {
      disabled: fieldDisabled,
      name: fieldName,
      onBlur: controllerOnBlur,
      onChange: controllerOnChange,
      ref: inputRef,
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
  const value = typeof fieldValue === "string" || typeof fieldValue === "number" ? fieldValue : "";

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    controllerOnBlur();
    onBlur?.(event);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    controllerOnChange(event);
    onChange?.(event);
  };

  return (
    <TextField
      {...textFieldProps}
      ref={inputRef}
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

export { FormTextField, type FormTextFieldProps };
