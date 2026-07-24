"use client";

import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form";

import { SelectField, type SelectFieldProps } from "@/components/base/field/select/base";

type FormSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue extends string = string,
> = Omit<SelectFieldProps<TValue>, "defaultValue" | "error" | "isInvalid" | "name" | "value"> &
  Pick<UseControllerProps<TFieldValues, TName>, "defaultValue" | "rules" | "shouldUnregister"> & {
    name: TName;
  };

function FormSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue extends string = string,
>({
  name,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  onValueChange,
  triggerProps,
  ...selectFieldProps
}: FormSelectFieldProps<TFieldValues, TName, TValue>) {
  const { control } = useFormContext<TFieldValues>();
  const {
    field: {
      disabled: fieldDisabled,
      name: fieldName,
      onBlur: controllerOnBlur,
      onChange: controllerOnChange,
      ref: triggerRef,
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
  const value = typeof fieldValue === "string" ? (fieldValue as TValue) : null;
  const { onBlur, ...resolvedTriggerProps } = triggerProps ?? {};

  const handleBlur: NonNullable<NonNullable<SelectFieldProps<TValue>["triggerProps"]>["onBlur"]> = (
    event,
  ) => {
    controllerOnBlur();
    onBlur?.(event);
  };

  const handleValueChange: NonNullable<SelectFieldProps<TValue>["onValueChange"]> = (
    nextValue,
    eventDetails,
  ) => {
    controllerOnChange(nextValue);
    onValueChange?.(nextValue, eventDetails);
  };

  return (
    <SelectField
      {...selectFieldProps}
      name={fieldName}
      disabled={fieldDisabled}
      value={value}
      isInvalid={fieldState.invalid}
      error={fieldState.error?.message}
      onValueChange={handleValueChange}
      triggerProps={{
        ...resolvedTriggerProps,
        ref: triggerRef,
        onBlur: handleBlur,
      }}
    />
  );
}

export { FormSelectField, type FormSelectFieldProps };
