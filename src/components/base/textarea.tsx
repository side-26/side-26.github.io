import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "tw:flex tw:field-sizing-content tw:min-h-16 tw:w-full tw:resize-none tw:rounded-2xl tw:border tw:glass-surface tw:px-3 tw:py-3 tw:text-base tw:transition-[color,background-color,border-color,box-shadow,opacity] tw:outline-none tw:placeholder:text-muted-foreground tw:focus-visible:border-ring tw:focus-visible:ring-3 tw:focus-visible:ring-ring/30 tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:aria-invalid:border-destructive tw:aria-invalid:ring-3 tw:aria-invalid:ring-destructive/20 tw:motion-reduce:transition-none tw:md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
