"use client";

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  useId,
  useImperativeHandle,
} from "react";
import {
  type FieldErrors,
  type FieldValues,
  FormProvider,
  type Path,
  type Resolver,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
  type UseFormSetError,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { getApiFieldMessages, isApiError, type ApiError } from "@/lib/api/errors";

type BaseFormHandle<TFieldValues extends FieldValues = FieldValues> = {
  setError: UseFormSetError<TFieldValues>;
};

type BaseFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
> = Omit<ComponentPropsWithoutRef<"form">, "children" | "onSubmit"> & {
  children:
    ReactNode | ((form: UseFormReturn<TFieldValues, TContext, TTransformedValues>) => ReactNode);
  errorSummaryTitle?: ReactNode;
  formOptions?: Omit<UseFormProps<TFieldValues, TContext, TTransformedValues>, "resolver">;
  onInvalidSubmit?: SubmitErrorHandler<TFieldValues>;
  onSubmit: SubmitHandler<TTransformedValues>;
  onSubmitError?: (error: ApiError) => Promise<void> | void;
  ref?: Ref<BaseFormHandle<TFieldValues>>;
  resolver?: Resolver<TFieldValues, TContext, TTransformedValues>;
  showErrorSummary?: boolean;
};

const ignoredErrorKeys = new Set(["message", "ref", "type", "types"]);

function getErrorMessages(errors: FieldErrors): string[] {
  const messages = new Set<string>();
  const visited = new WeakSet<object>();

  function visit(value: unknown) {
    if (!value || typeof value !== "object" || visited.has(value)) {
      return;
    }

    visited.add(value);

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    const error = value as Record<string, unknown>;

    if (typeof error.message === "string" && error.message.trim()) {
      messages.add(error.message);
    }

    if (error.types && typeof error.types === "object") {
      Object.values(error.types).forEach((message) => {
        if (typeof message === "string" && message.trim()) {
          messages.add(message);
        } else if (Array.isArray(message)) {
          message.forEach((item) => {
            if (typeof item === "string" && item.trim()) {
              messages.add(item);
            }
          });
        }
      });
    }

    Object.entries(error).forEach(([key, nestedError]) => {
      if (!ignoredErrorKeys.has(key)) {
        visit(nestedError);
      }
    });
  }

  visit(errors);

  return [...messages];
}

function BaseFormErrorSummary({ title }: { title: ReactNode }) {
  const titleId = useId();
  const { control } = useFormContext();
  const { errors } = useFormState({ control });
  const messages = getErrorMessages(errors);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-atomic="true"
      aria-labelledby={titleId}
      data-slot="base-form-error-summary"
      className="tw:mb-6 tw:rounded-2xl tw:border tw:glass-surface tw:border-destructive/25 tw:p-4 tw:text-destructive tw:[--glass-fallback-background:var(--background)]"
    >
      <p id={titleId} className="tw:text-sm tw:font-medium">
        {title}
      </p>
      <ul className="tw:mt-2 tw:list-disc tw:space-y-1 tw:ps-5 tw:text-sm">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

function BaseForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  children,
  errorSummaryTitle = "Please review the form",
  formOptions,
  noValidate = true,
  onInvalidSubmit,
  onSubmit,
  onSubmitError,
  ref,
  resolver,
  showErrorSummary = true,
  ...formProps
}: BaseFormProps<TFieldValues, TContext, TTransformedValues>) {
  const form = useForm<TFieldValues, TContext, TTransformedValues>({
    ...formOptions,
    resolver,
  });

  useImperativeHandle(ref, () => ({ setError: form.setError }), [form.setError]);

  const handleSubmit: SubmitHandler<TTransformedValues> = async (values, event) => {
    try {
      await onSubmit(values, event);
    } catch (error) {
      if (!isApiError(error)) {
        throw error;
      }

      const fieldMessages = getApiFieldMessages(error);

      if (fieldMessages.length > 0) {
        fieldMessages.forEach(({ messages, name }, index) => {
          form.setError(
            name as Path<TFieldValues>,
            {
              message: messages[0],
              type: "server",
              types: Object.fromEntries(
                messages.map((message, messageIndex) => [`server.${messageIndex}`, message]),
              ),
            },
            { shouldFocus: index === 0 },
          );
        });

        return;
      }

      if (onSubmitError) {
        await onSubmitError(error);
        return;
      }

      form.setError("root.server", {
        message: error.message,
        type: "server",
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        {...formProps}
        data-slot="base-form"
        noValidate={noValidate}
        onSubmit={form.handleSubmit(handleSubmit, onInvalidSubmit)}
      >
        {showErrorSummary ? <BaseFormErrorSummary title={errorSummaryTitle} /> : null}
        {typeof children === "function" ? children(form) : children}
      </form>
    </FormProvider>
  );
}

export { BaseForm, type BaseFormHandle, type BaseFormProps };
