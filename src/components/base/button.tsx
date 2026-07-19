import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "tw:group/button tw:relative tw:isolate tw:inline-flex tw:shrink-0 tw:items-center tw:justify-center tw:overflow-hidden tw:rounded-xl tw:border tw:border-[var(--glass-border)] tw:bg-clip-padding tw:text-sm tw:font-medium tw:whitespace-nowrap tw:shadow-[inset_0_1px_0_var(--glass-highlight),0_1px_2px_var(--glass-shadow),0_8px_24px_var(--glass-shadow-soft)] tw:backdrop-blur-xl tw:backdrop-saturate-150 tw:transition-[color,background-color,border-color,box-shadow,transform,opacity] tw:duration-200 tw:outline-none tw:select-none tw:[--glass-fallback-background:var(--background)] tw:before:pointer-events-none tw:before:absolute tw:before:inset-x-1 tw:before:top-px tw:before:h-px tw:before:rounded-full tw:before:bg-[var(--glass-highlight)] tw:focus-visible:border-ring tw:focus-visible:ring-3 tw:focus-visible:ring-ring/35 tw:active:not-aria-[haspopup]:translate-y-px tw:disabled:pointer-events-none tw:disabled:opacity-55 tw:aria-invalid:border-destructive tw:aria-invalid:ring-3 tw:aria-invalid:ring-destructive/20 tw:motion-reduce:transition-none tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "tw:bg-primary/80 tw:text-primary-foreground tw:[--glass-fallback-background:var(--primary)] tw:hover:bg-primary/90",
        outline:
          "tw:bg-background/60 tw:text-foreground tw:hover:bg-muted/75 tw:aria-expanded:bg-muted/75",
        secondary:
          "tw:bg-secondary/75 tw:text-secondary-foreground tw:[--glass-fallback-background:var(--secondary)] tw:hover:bg-secondary/90 tw:aria-expanded:bg-secondary/90",
        ghost:
          "tw:border-transparent tw:bg-background/20 tw:text-foreground tw:shadow-none tw:hover:border-border tw:hover:bg-muted/55 tw:aria-expanded:bg-muted/55",
        destructive:
          "tw:border-destructive/25 tw:bg-destructive/15 tw:text-destructive tw:hover:bg-destructive/25 tw:focus-visible:border-destructive/40 tw:focus-visible:ring-destructive/20",
        link: "tw:border-transparent tw:bg-transparent tw:text-primary tw:underline-offset-4 tw:shadow-none tw:backdrop-blur-none tw:before:hidden tw:hover:underline",
      },
      size: {
        default:
          "tw:h-9 tw:gap-1.5 tw:px-3 tw:has-data-[icon=inline-end]:pe-2.5 tw:has-data-[icon=inline-start]:ps-2.5",
        xs: "tw:h-6 tw:gap-1 tw:px-2.5 tw:text-xs tw:has-data-[icon=inline-end]:pe-2 tw:has-data-[icon=inline-start]:ps-2 tw:[&_svg:not([class*='size-'])]:size-3",
        sm: "tw:h-8 tw:gap-1 tw:px-3 tw:has-data-[icon=inline-end]:pe-2 tw:has-data-[icon=inline-start]:ps-2",
        lg: "tw:h-10 tw:gap-1.5 tw:px-4 tw:has-data-[icon=inline-end]:pe-3 tw:has-data-[icon=inline-start]:ps-3",
        icon: "tw:size-9",
        "icon-xs": "tw:size-6 tw:[&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "tw:size-8",
        "icon-lg": "tw:size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = Omit<ButtonPrimitive.Props, "children"> &
  VariantProps<typeof buttonVariants> & {
    children?: ReactNode;
    isLoading?: boolean;
    loadingText?: ReactNode;
  };

function Button({
  children,
  className,
  disabled,
  isLoading = false,
  loadingText,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      {...props}
      data-slot="button"
      data-glass-surface={variant === "link" ? undefined : ""}
      data-loading={isLoading ? "" : undefined}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size, className }))}
    >
      <span
        data-slot="button-content"
        aria-live={isLoading ? "polite" : undefined}
        className="tw:relative tw:z-10 tw:inline-flex tw:items-center tw:justify-center tw:gap-[inherit]"
      >
        {isLoading ? (loadingText ?? children) : children}
      </span>

      {isLoading ? (
        <span
          data-slot="button-loading-track"
          aria-hidden="true"
          className="tw:absolute tw:inset-x-0 tw:bottom-0 tw:h-0.5 tw:overflow-hidden tw:bg-current/15"
        >
          <span
            data-slot="button-loading-bar"
            className="tw:block tw:h-full tw:w-1/3 tw:animate-[button-loading_1.2s_ease-in-out_infinite] tw:bg-current tw:motion-reduce:animate-none"
          />
        </span>
      ) : null}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants, type ButtonProps };
