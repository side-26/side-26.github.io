import type { ComponentProps, CSSProperties } from "react";
import type { SimpleIcon } from "simple-icons";

import { cn } from "@/lib/utils";

type TechnologyMarkProps = Omit<ComponentProps<"li">, "children"> & {
  icon: SimpleIcon;
  label?: string;
  tilt?: "left" | "right";
};

function TechnologyMark({
  className,
  icon,
  label = icon.title,
  style,
  tilt = "right",
  ...props
}: TechnologyMarkProps) {
  const brandColor = icon.hex === "000000" ? "var(--foreground)" : `#${icon.hex}`;
  const technologyStyle = {
    ...style,
    "--technology-color": brandColor,
  } as CSSProperties;

  return (
    <li
      data-technology-mark
      data-tilt={tilt}
      style={technologyStyle}
      className={cn(
        "tw:relative tw:flex tw:min-h-28 tw:flex-col tw:justify-between tw:overflow-hidden tw:rounded-2xl tw:border tw:glass-surface tw:p-4",
        className,
      )}
      {...props}
    >
      <span
        data-technology-icon
        aria-hidden="true"
        className="tw:grid tw:size-11 tw:place-items-center tw:text-muted-foreground"
      >
        <svg viewBox="0 0 24 24" className="tw:size-9" fill="currentColor">
          <path d={icon.path} />
        </svg>
      </span>
      <span
        data-technology-label
        className="tw:text-sm tw:font-bold tw:tracking-[-0.01em] tw:text-foreground"
      >
        {label}
      </span>
    </li>
  );
}

export { TechnologyMark };
