import Image, { type ImageProps } from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type FigureImageProps = Omit<ImageProps, "fill" | "height" | "sizes" | "width"> & {
  /** Describes the rendered image width at each viewport breakpoint. */
  sizes: string;
  /** Controls the responsive figure box used by the fill image. */
  aspectRatio?: CSSProperties["aspectRatio"];
  /** Controls how the image fits its figure without imposing a default. */
  objectFit?: CSSProperties["objectFit"];
  /** Styles the outer figure without affecting the image element. */
  figureClassName?: string;
  figureStyle?: CSSProperties;
  /** Adds an accessible semantic caption over the bottom of the image. */
  caption?: ReactNode;
  captionClassName?: string;
};

function FigureImage({
  alt,
  aspectRatio = "16 / 9",
  caption,
  captionClassName,
  className,
  figureClassName,
  figureStyle,
  objectFit,
  sizes,
  style,
  ...imageProps
}: FigureImageProps) {
  const imageStyle = objectFit ? { ...style, objectFit } : style;

  return (
    <figure
      data-slot="figure-image"
      className={cn(
        "tw:relative tw:isolate tw:block tw:w-full tw:overflow-hidden",
        figureClassName,
      )}
      style={{ aspectRatio, ...figureStyle }}
    >
      <Image
        {...imageProps}
        fill
        alt={alt}
        sizes={sizes}
        className={className}
        style={imageStyle}
      />
      {caption ? (
        <figcaption
          data-slot="figure-image-caption"
          className={cn(
            "tw:absolute tw:inset-x-0 tw:bottom-0 tw:z-10 tw:bg-black/60 tw:px-3 tw:py-2 tw:text-sm tw:text-white",
            captionClassName,
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export { FigureImage, type FigureImageProps };
