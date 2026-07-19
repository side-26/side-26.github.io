import { Input as InputPrimitive } from "@base-ui/react/input";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "tw:h-9 tw:w-full tw:min-w-0 tw:rounded-3xl tw:border tw:glass-surface tw:px-3 tw:py-1 tw:text-base tw:transition-[color,background-color,border-color,box-shadow,opacity] tw:outline-none tw:file:inline-flex tw:file:h-7 tw:file:border-0 tw:file:bg-transparent tw:file:text-sm tw:file:font-medium tw:file:text-foreground tw:placeholder:text-muted-foreground tw:focus-visible:border-ring tw:focus-visible:ring-3 tw:focus-visible:ring-ring/30 tw:disabled:pointer-events-none tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:aria-invalid:border-destructive tw:aria-invalid:ring-3 tw:aria-invalid:ring-destructive/20 tw:motion-reduce:transition-none tw:md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
