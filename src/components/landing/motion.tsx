"use client";

import {
  domAnimation,
  LazyMotion,
  m,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useSyncExternalStore, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;
const subscribeToHydration = () => () => {};

function useHasHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
}

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}

function MotionReveal({ children, className, delay = 0, distance = 28 }: MotionRevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -64px" }}
      transition={{ duration: 0.72, delay, ease: easeOut }}
    >
      {children}
    </m.div>
  );
}

function HeroEntrance({
  children,
  className,
  delay = 0,
}: Pick<MotionRevealProps, "children" | "className" | "delay">) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: easeOut }}
    >
      {children}
    </m.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.25,
  });

  return (
    <m.div
      aria-hidden="true"
      className="tw:fixed tw:inset-x-0 tw:top-0 tw:z-50 tw:h-0.5 tw:origin-left tw:bg-primary"
      style={{ scaleX }}
    />
  );
}

function ArchitectureBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="tw:pointer-events-none tw:fixed tw:inset-0 tw:z-0 tw:overflow-hidden"
    >
      <div data-landing-grid className="tw:absolute tw:inset-0 tw:opacity-35" />
      <m.div
        className="tw:absolute tw:-top-48 tw:-right-36 tw:size-160 tw:rounded-full tw:border tw:border-primary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 54, ease: "linear", repeat: Infinity }}
      >
        <div className="tw:absolute tw:top-1/2 tw:-left-1.5 tw:size-3 tw:rounded-full tw:bg-primary tw:shadow-[0_0_32px_var(--primary)]" />
      </m.div>
      <m.div
        className="tw:absolute tw:top-[36%] tw:-left-56 tw:size-128 tw:rounded-full tw:border tw:border-trust/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 68, ease: "linear", repeat: Infinity }}
      >
        <div className="tw:absolute tw:right-1/4 tw:-bottom-1 tw:size-2 tw:rounded-full tw:bg-trust tw:shadow-[0_0_28px_var(--trust)]" />
      </m.div>
      <m.div
        className="tw:absolute tw:top-[12%] tw:right-[12%] tw:h-80 tw:w-80 tw:rounded-full tw:bg-primary/8 tw:blur-3xl"
        animate={{
          opacity: [0.35, 0.7, 0.35],
          scale: [0.92, 1.08, 0.92],
        }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />
      <m.div
        className="tw:absolute tw:bottom-[8%] tw:left-[18%] tw:h-72 tw:w-72 tw:rounded-full tw:bg-trust/8 tw:blur-3xl"
        animate={{
          opacity: [0.28, 0.58, 0.28],
          x: [-18, 18, -18],
        }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );
}

function PortraitParallax({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasHydrated = useHasHydrated();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <m.div
      ref={containerRef}
      style={{ y: hasHydrated && shouldReduceMotion ? 0 : y }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.18, ease: easeOut }}
    >
      {children}
    </m.div>
  );
}

function ProcessTrack({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "tw:absolute tw:top-5 tw:right-5 tw:left-5 tw:h-px tw:overflow-hidden tw:bg-border tw:lg:top-6",
        className,
      )}
    >
      <m.div
        className="tw:h-full tw:origin-left tw:bg-primary"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.4, ease: easeOut }}
      />
    </div>
  );
}

export {
  ArchitectureBackdrop,
  HeroEntrance,
  MotionProvider,
  MotionReveal,
  PortraitParallax,
  ProcessTrack,
  ScrollProgress,
};
