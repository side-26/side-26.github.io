"use client";

import {
  DirectionProvider as DirectionProviderPrimitive,
  type DirectionProviderProps,
  useDirection,
} from "@base-ui/react/direction-provider";

function DirectionProvider({ direction = "rtl", ...props }: DirectionProviderProps) {
  return <DirectionProviderPrimitive direction={direction} {...props} />;
}

export { DirectionProvider, useDirection };
