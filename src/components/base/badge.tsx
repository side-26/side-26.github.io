import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "tw:group/badge tw:inline-flex tw:h-5 tw:w-fit tw:shrink-0 tw:items-center tw:justify-center tw:gap-1 tw:overflow-hidden tw:rounded-3xl tw:border tw:border-[var(--glass-border)] tw:px-2 tw:py-0.5 tw:text-xs tw:font-medium tw:whitespace-nowrap tw:shadow-[inset_0_1px_0_var(--glass-highlight),0_1px_2px_var(--glass-shadow)] tw:backdrop-blur-xl tw:backdrop-saturate-150 tw:transition-[color,background-color,border-color,box-shadow,opacity] tw:outline-none tw:[--glass-fallback-background:var(--background)] tw:focus-visible:border-ring tw:focus-visible:ring-[3px] tw:focus-visible:ring-ring/50 tw:has-data-[icon=inline-end]:pe-1.5 tw:has-data-[icon=inline-start]:ps-1.5 tw:aria-invalid:border-destructive tw:aria-invalid:ring-destructive/20 tw:motion-reduce:transition-none tw:[&>svg]:pointer-events-none tw:[&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "tw:bg-primary/80 tw:text-primary-foreground tw:[--glass-fallback-background:var(--primary)] tw:[a]:hover:bg-primary/90",
        secondary:
          "tw:bg-secondary/75 tw:text-secondary-foreground tw:[--glass-fallback-background:var(--secondary)] tw:[a]:hover:bg-secondary/90",
        destructive:
          "tw:border-destructive/25 tw:bg-destructive/15 tw:text-destructive tw:focus-visible:ring-destructive/20 tw:[a]:hover:bg-destructive/25",
        outline:
          "tw:bg-background/60 tw:text-foreground tw:[a]:hover:bg-muted/75 tw:[a]:hover:text-foreground",
        ghost:
          "tw:border-transparent tw:bg-background/20 tw:text-foreground tw:shadow-none tw:hover:border-border tw:hover:bg-muted/55",
        link: "tw:border-transparent tw:bg-transparent tw:text-primary tw:underline-offset-4 tw:shadow-none tw:backdrop-blur-none tw:backdrop-saturate-100 tw:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
