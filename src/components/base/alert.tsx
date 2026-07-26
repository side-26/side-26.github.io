import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "tw:relative tw:grid tw:w-full tw:grid-cols-[0_1fr] tw:items-start tw:gap-y-1 tw:rounded-2xl tw:border tw:px-4 tw:py-3 tw:text-sm tw:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] tw:backdrop-blur-md tw:transition-colors tw:has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] tw:has-[>svg]:gap-x-3 tw:[&>svg]:size-4 tw:[&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "tw:border-border/70 tw:bg-background/45 tw:text-card-foreground",
        success:
          "tw:border-trust/35 tw:bg-trust/10 tw:text-trust tw:[&_[data-slot=alert-description]]:text-foreground/75",
        destructive:
          "tw:border-destructive/35 tw:bg-destructive/10 tw:text-destructive tw:[&_[data-slot=alert-description]]:text-foreground/75",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-glass-surface
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "tw:col-start-2 tw:line-clamp-1 tw:min-h-4 tw:font-medium tw:tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "tw:col-start-2 tw:grid tw:justify-items-start tw:gap-1 tw:text-sm tw:text-muted-foreground tw:[&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
