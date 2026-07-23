import type { Metadata } from "next";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Circle,
  CodeXml,
  Database,
  GitBranch,
  Layers3,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import {
  ArchitectureBackdrop,
  HeroEntrance,
  MotionProvider,
  MotionReveal,
  PortraitParallax,
  ProcessTrack,
  ScrollProgress,
} from "@/components/landing/motion";
import { Badge } from "@/components/base/badge";
import { buttonVariants } from "@/components/base/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/card";
import { FigureImage } from "@/components/base/image";
import { Separator } from "@/components/base/separator";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mahdi Rashidi | Full-Stack Developer",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

const trustCommitments = [
  {
    phase: "Before build",
    title: "We make the unknowns visible.",
    description:
      "The brief becomes a scoped system map: users, critical flows, technical risks, and a release path everyone can understand.",
    proof: "Scope · architecture · priorities",
  },
  {
    phase: "During build",
    title: "Progress stays inspectable.",
    description:
      "Small, reviewable delivery loops keep decisions, trade-offs, and working software in view—before they become expensive surprises.",
    proof: "Working increments · clear decisions",
  },
  {
    phase: "Before handoff",
    title: "The product is prepared to outlive the sprint.",
    description:
      "Accessibility, performance, maintainability, and release checks are part of the build, not a cleanup phase at the end.",
    proof: "Quality checks · documentation · release",
  },
] as const;

const capabilities = [
  {
    label: "Product surface",
    title: "Interfaces people can trust on first contact.",
    description:
      "Responsive, accessible experiences with a deliberate visual system, clear interaction states, and performance treated as part of the design.",
    items: ["React & Next.js", "Design systems", "Accessibility", "Motion with purpose"],
    icon: Layers3,
  },
  {
    label: "Application core",
    title: "Systems that make the interface dependable.",
    description:
      "Clear application boundaries, typed data flows, API thinking, validation, and maintainable server-side behavior behind every visible promise.",
    items: ["Server rendering", "API integration", "Data modeling", "Validation & errors"],
    icon: Database,
  },
  {
    label: "Delivery control",
    title: "A release path stakeholders can follow.",
    description:
      "The work is broken into testable increments with explicit trade-offs, production checks, and a handoff that does not depend on hidden context.",
    items: ["Technical planning", "Code quality", "SEO & performance", "Release readiness"],
    icon: Workflow,
  },
] as const;

const deliverySteps = [
  {
    step: "01",
    title: "Read the real problem",
    description:
      "Clarify the user, business pressure, constraints, and what success must look like.",
  },
  {
    step: "02",
    title: "Map the whole system",
    description:
      "Turn the brief into flows, boundaries, risks, milestones, and a credible release shape.",
  },
  {
    step: "03",
    title: "Build in visible loops",
    description:
      "Ship the highest-risk slices early, review working software, and keep decisions reversible.",
  },
  {
    step: "04",
    title: "Release with context",
    description:
      "Verify the product, document what matters, and leave the next owner a clear path forward.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url.href,
  image: new URL("/images/mahdi-rashidi.webp", siteConfig.url).href,
  sameAs: [siteConfig.githubUrl],
  jobTitle: "Full-Stack Developer",
  description: siteConfig.description,
  knowsAbout: [
    "Full-stack web development",
    "React",
    "Next.js",
    "TypeScript",
    "Accessible user interfaces",
    "Technical architecture",
    "Search engine optimization",
  ],
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="tw:flex tw:max-w-3xl tw:flex-col tw:gap-5">
      <p className="tw:font-mono tw:text-xs tw:font-medium tw:tracking-[0.22em] tw:text-primary tw:uppercase">
        {eyebrow}
      </p>
      <h2 className="tw:text-3xl tw:font-extrabold tw:tracking-[-0.035em] tw:text-balance tw:sm:text-4xl tw:lg:text-5xl">
        {title}
      </h2>
      <p className="tw:max-w-2xl tw:text-base tw:leading-8 tw:text-muted-foreground tw:sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <MotionProvider>
      <ScrollProgress />
      <ArchitectureBackdrop />

      <div className="tw:relative tw:z-10 tw:mx-auto tw:flex tw:min-h-screen tw:w-full tw:max-w-7xl tw:flex-col tw:px-4 tw:pb-8 tw:sm:px-6 tw:lg:px-8">
        <header className="tw:sticky tw:top-4 tw:z-40 tw:mt-4 tw:flex tw:items-center tw:justify-between tw:gap-4 tw:rounded-2xl tw:border tw:glass-surface tw:px-4 tw:py-3 tw:sm:px-5">
          <a
            href="#top"
            aria-label="Mahdi Rashidi, back to the top"
            className="tw:flex tw:items-center tw:gap-3 tw:rounded-lg tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-ring/35"
          >
            <span className="tw:grid tw:size-9 tw:place-items-center tw:rounded-lg tw:border tw:border-primary/35 tw:bg-primary/10 tw:font-mono tw:text-xs tw:font-bold tw:text-primary">
              MR
            </span>
            <span className="tw:hidden tw:flex-col tw:sm:flex">
              <span className="tw:text-sm tw:font-bold">Mahdi Rashidi</span>
              <span className="tw:font-mono tw:text-[0.65rem] tw:tracking-[0.16em] tw:text-muted-foreground tw:uppercase">
                Full-stack developer
              </span>
            </span>
          </a>

          <nav
            aria-label="Primary navigation"
            className="tw:hidden tw:items-center tw:gap-6 tw:md:flex"
          >
            <a
              href="#trust"
              className="tw:rounded-sm tw:text-sm tw:text-muted-foreground tw:transition-colors tw:hover:text-foreground tw:focus-visible:ring-3 tw:focus-visible:ring-ring/35 tw:focus-visible:outline-none"
            >
              How I work
            </a>
            <a
              href="#capabilities"
              className="tw:rounded-sm tw:text-sm tw:text-muted-foreground tw:transition-colors tw:hover:text-foreground tw:focus-visible:ring-3 tw:focus-visible:ring-ring/35 tw:focus-visible:outline-none"
            >
              Capabilities
            </a>
            <a
              href="#proof"
              className="tw:rounded-sm tw:text-sm tw:text-muted-foreground tw:transition-colors tw:hover:text-foreground tw:focus-visible:ring-3 tw:focus-visible:ring-ring/35 tw:focus-visible:outline-none"
            >
              Proof
            </a>
          </nav>

          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            GitHub
            <ArrowUpRight data-icon="inline-end" />
          </a>
        </header>

        <main>
          <section
            id="top"
            aria-labelledby="hero-title"
            className="tw:grid tw:min-h-[calc(100svh-5rem)] tw:items-center tw:gap-14 tw:py-20 tw:lg:grid-cols-[1.08fr_0.92fr] tw:lg:gap-20 tw:lg:py-28"
          >
            <div className="tw:flex tw:flex-col tw:items-start tw:gap-8">
              <HeroEntrance delay={0.02}>
                <Badge variant="outline">
                  <Circle data-icon="inline-start" className="tw:fill-trust tw:text-trust" />
                  Open to full-stack project conversations
                </Badge>
              </HeroEntrance>

              <HeroEntrance delay={0.1}>
                <div className="tw:flex tw:flex-col tw:gap-5">
                  <p className="tw:font-mono tw:text-xs tw:tracking-[0.24em] tw:text-primary tw:uppercase">
                    Brief → build → stable release
                  </p>
                  <h1
                    id="hero-title"
                    className="tw:max-w-4xl tw:text-[clamp(3rem,8vw,6.7rem)] tw:leading-[0.94] tw:font-extrabold tw:tracking-[-0.065em] tw:text-balance"
                  >
                    One accountable builder for the{" "}
                    <span className="tw:text-primary">whole product.</span>
                  </h1>
                </div>
              </HeroEntrance>

              <HeroEntrance delay={0.18}>
                <p className="tw:max-w-2xl tw:text-lg tw:leading-8 tw:text-muted-foreground tw:sm:text-xl tw:sm:leading-9">
                  I’m Mahdi Rashidi, a full-stack developer who turns ambitious briefs into
                  dependable digital products—with clear decisions, visible progress, and no mystery
                  between the interface and the system behind it.
                </p>
              </HeroEntrance>

              <HeroEntrance
                delay={0.26}
                className="tw:flex tw:w-full tw:flex-col tw:gap-3 tw:sm:w-auto tw:sm:flex-row"
              >
                <a
                  href="#contact"
                  className={buttonVariants({
                    size: "lg",
                    className: "tw:w-full tw:sm:w-auto",
                  })}
                >
                  Discuss a project
                  <ArrowDown data-icon="inline-end" />
                </a>
                <a
                  href="#trust"
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className: "tw:w-full tw:sm:w-auto",
                  })}
                >
                  See how I work
                </a>
              </HeroEntrance>

              <HeroEntrance delay={0.34} className="tw:w-full">
                <dl className="tw:grid tw:w-full tw:gap-5 tw:border-t tw:border-border tw:pt-6 tw:sm:grid-cols-3">
                  {[
                    ["Scope first", "Unknowns surfaced early"],
                    ["SSR-first", "Less JavaScript by default"],
                    ["Public source", "Inspect the work yourself"],
                  ].map(([term, detail]) => (
                    <div key={term} className="tw:flex tw:flex-col tw:gap-1">
                      <dt className="tw:text-sm tw:font-bold">{term}</dt>
                      <dd className="tw:text-xs tw:leading-5 tw:text-muted-foreground">{detail}</dd>
                    </div>
                  ))}
                </dl>
              </HeroEntrance>
            </div>

            <PortraitParallax>
              <div
                data-dossier
                className="tw:relative tw:mx-auto tw:w-full tw:max-w-xl tw:p-3 tw:sm:p-5"
              >
                <div className="tw:relative tw:overflow-hidden tw:rounded-[2rem] tw:border tw:border-border tw:bg-card">
                  <FigureImage
                    src="/images/mahdi-rashidi.webp"
                    alt="Portrait of Mahdi Rashidi, full-stack developer"
                    sizes="(max-width: 1023px) 92vw, 42vw"
                    aspectRatio="4 / 5"
                    objectFit="cover"
                    priority
                    className="tw:object-[50%_35%]"
                  />
                  <div
                    aria-hidden="true"
                    className="tw:absolute tw:inset-0 tw:bg-[linear-gradient(to_top,rgba(11,11,12,.82)_0%,transparent_42%)]"
                  />
                  <div className="tw:absolute tw:inset-x-0 tw:bottom-0 tw:flex tw:items-end tw:justify-between tw:gap-6 tw:p-6 tw:sm:p-8">
                    <div className="tw:flex tw:flex-col tw:gap-1">
                      <span className="tw:font-mono tw:text-[0.65rem] tw:tracking-[0.2em] tw:text-primary tw:uppercase">
                        Case owner
                      </span>
                      <span className="tw:text-xl tw:font-bold">Mahdi Rashidi</span>
                    </div>
                    <span className="tw:font-mono tw:text-[0.65rem] tw:tracking-[0.16em] tw:text-muted-foreground tw:uppercase">
                      MR / 2026
                    </span>
                  </div>
                </div>

                <div className="tw:absolute tw:top-12 tw:-left-2 tw:flex tw:w-44 tw:flex-col tw:gap-3 tw:rounded-2xl tw:border tw:glass-surface tw:p-4 tw:sm:-left-7">
                  <div className="tw:flex tw:items-center tw:justify-between tw:gap-3">
                    <span className="tw:font-mono tw:text-[0.65rem] tw:tracking-[0.16em] tw:text-muted-foreground tw:uppercase">
                      Delivery map
                    </span>
                    <span className="tw:size-2 tw:rounded-full tw:bg-trust tw:shadow-[0_0_18px_var(--trust)]" />
                  </div>
                  <Separator />
                  <ol className="tw:flex tw:flex-col tw:gap-2 tw:text-xs">
                    <li className="tw:flex tw:justify-between tw:gap-4">
                      <span className="tw:text-muted-foreground">01</span>
                      <span>Interface</span>
                    </li>
                    <li className="tw:flex tw:justify-between tw:gap-4">
                      <span className="tw:text-muted-foreground">02</span>
                      <span>Systems</span>
                    </li>
                    <li className="tw:flex tw:justify-between tw:gap-4">
                      <span className="tw:text-muted-foreground">03</span>
                      <span>Release</span>
                    </li>
                  </ol>
                </div>

                <p
                  data-vertical-label
                  className="tw:absolute tw:top-1/2 tw:-right-2 tw:font-mono tw:text-[0.6rem] tw:tracking-[0.28em] tw:text-primary tw:uppercase tw:sm:-right-5"
                >
                  Full product accountability
                </p>
              </div>
            </PortraitParallax>
          </section>

          <section id="trust" aria-labelledby="trust-title" className="tw:py-24 tw:sm:py-32">
            <MotionReveal>
              <SectionHeading
                eyebrow="The trust ledger"
                title="Trust is not a claim. It is a delivery system."
                description="A strong stack matters. What stakeholders feel, however, is whether the project stays understandable, inspectable, and under control from the first decision to the final handoff."
              />
            </MotionReveal>

            <div className="tw:mt-14 tw:overflow-hidden tw:rounded-4xl tw:border tw:glass-surface">
              {trustCommitments.map((commitment, index) => (
                <MotionReveal key={commitment.phase} delay={index * 0.08} distance={18}>
                  <article className="tw:grid tw:gap-6 tw:p-6 tw:sm:p-8 tw:lg:grid-cols-[0.55fr_1fr_0.8fr] tw:lg:items-start tw:lg:gap-10">
                    <div className="tw:flex tw:items-center tw:gap-3">
                      <span className="tw:grid tw:size-9 tw:place-items-center tw:rounded-full tw:border tw:border-primary/35 tw:bg-primary/10 tw:font-mono tw:text-xs tw:text-primary">
                        0{index + 1}
                      </span>
                      <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-muted-foreground tw:uppercase">
                        {commitment.phase}
                      </p>
                    </div>
                    <div className="tw:flex tw:flex-col tw:gap-3">
                      <h3 className="tw:text-xl tw:font-bold tw:tracking-[-0.02em] tw:sm:text-2xl">
                        {commitment.title}
                      </h3>
                      <p className="tw:max-w-xl tw:leading-7 tw:text-muted-foreground">
                        {commitment.description}
                      </p>
                    </div>
                    <p className="tw:border-s tw:border-primary/35 tw:ps-5 tw:font-mono tw:text-xs tw:leading-6 tw:tracking-[0.08em] tw:text-primary tw:uppercase">
                      {commitment.proof}
                    </p>
                  </article>
                  {index < trustCommitments.length - 1 ? <Separator /> : null}
                </MotionReveal>
              ))}
            </div>
          </section>

          <section
            id="capabilities"
            aria-labelledby="capabilities-title"
            className="tw:py-24 tw:sm:py-32"
          >
            <MotionReveal>
              <SectionHeading
                eyebrow="End-to-end ownership"
                title="The interface, the application, and the release belong to one story."
                description="I work across the full product boundary so design decisions survive implementation and technical decisions remain legible to the people funding and using the product."
              />
            </MotionReveal>

            <div className="tw:mt-14 tw:grid tw:gap-5 tw:lg:grid-cols-3">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;

                return (
                  <MotionReveal key={capability.label} delay={index * 0.09}>
                    <Card className="tw:h-full">
                      <CardHeader>
                        <CardAction>
                          <span className="tw:grid tw:size-10 tw:place-items-center tw:rounded-xl tw:border tw:border-primary/30 tw:bg-primary/10 tw:text-primary">
                            <Icon aria-hidden="true" className="tw:size-5" />
                          </span>
                        </CardAction>
                        <CardDescription>
                          <span className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-primary tw:uppercase">
                            {capability.label}
                          </span>
                        </CardDescription>
                        <CardTitle>
                          <h3 className="tw:max-w-xs tw:pt-3 tw:text-2xl tw:leading-tight tw:font-bold tw:tracking-[-0.03em]">
                            {capability.title}
                          </h3>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="tw:flex tw:flex-1 tw:flex-col tw:gap-6">
                        <p className="tw:leading-7 tw:text-muted-foreground">
                          {capability.description}
                        </p>
                        <ul className="tw:flex tw:flex-col tw:gap-3">
                          {capability.items.map((item) => (
                            <li key={item} className="tw:flex tw:items-center tw:gap-3 tw:text-sm">
                              <Check aria-hidden="true" className="tw:size-4 tw:text-trust" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <p className="tw:font-mono tw:text-[0.65rem] tw:tracking-[0.14em] tw:text-muted-foreground tw:uppercase">
                          Part of the same delivery system
                        </p>
                      </CardFooter>
                    </Card>
                  </MotionReveal>
                );
              })}
            </div>
          </section>

          <section id="proof" aria-labelledby="proof-title" className="tw:py-24 tw:sm:py-32">
            <MotionReveal>
              <div className="tw:grid tw:gap-10 tw:lg:grid-cols-[0.82fr_1.18fr] tw:lg:items-start">
                <SectionHeading
                  eyebrow="Proof before promises"
                  title="This portfolio is the first case file."
                  description="The source is public because trust improves when the work can be inspected. The same standards described here are built into the page itself."
                />

                <Card>
                  <CardHeader>
                    <CardAction>
                      <Badge variant="secondary">Live evidence</Badge>
                    </CardAction>
                    <CardDescription>Portfolio system / current build</CardDescription>
                    <CardTitle>
                      <h3 className="tw:pt-2 tw:text-2xl tw:font-bold tw:tracking-[-0.03em]">
                        A working example of the delivery standard
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="tw:grid tw:gap-5 tw:sm:grid-cols-2">
                      {[
                        {
                          icon: CodeXml,
                          title: "Server-first architecture",
                          text: "Static content stays server-rendered; animation lives in focused client islands.",
                        },
                        {
                          icon: ShieldCheck,
                          title: "Accessible by construction",
                          text: "Semantic sections, keyboard focus, reduced motion, and meaningful content structure.",
                        },
                        {
                          icon: Workflow,
                          title: "Intentional motion",
                          text: "One ambient blueprint, a scroll progress signal, reveal choreography, and portrait depth.",
                        },
                        {
                          icon: GitBranch,
                          title: "Inspectable source",
                          text: "The implementation is public, typed, and organized around reusable project primitives.",
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <li key={item.title} className="tw:flex tw:gap-4">
                            <Icon
                              aria-hidden="true"
                              className="tw:mt-1 tw:size-5 tw:shrink-0 tw:text-primary"
                            />
                            <div className="tw:flex tw:flex-col tw:gap-1">
                              <span className="tw:font-bold">{item.title}</span>
                              <span className="tw:text-sm tw:leading-6 tw:text-muted-foreground">
                                {item.text}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <a
                      href={siteConfig.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({ variant: "outline" })}
                    >
                      Inspect the source
                      <ArrowUpRight data-icon="inline-end" />
                    </a>
                  </CardFooter>
                </Card>
              </div>
            </MotionReveal>
          </section>

          <section aria-labelledby="process-title" className="tw:py-24 tw:sm:py-32">
            <MotionReveal>
              <SectionHeading
                eyebrow="A visible working contract"
                title="The project always has a next known step."
                description="The sequence is simple on purpose: understand the pressure, map the system, build the riskiest truth first, then release with context."
              />
            </MotionReveal>

            <div className="tw:relative tw:mt-14">
              <ProcessTrack className="tw:hidden tw:lg:block" />
              <ol className="tw:grid tw:gap-6 tw:lg:grid-cols-4">
                {deliverySteps.map((item, index) => (
                  <MotionReveal key={item.step} delay={index * 0.08} distance={20}>
                    <li className="tw:relative tw:flex tw:h-full tw:flex-col tw:gap-5 tw:rounded-3xl tw:border tw:glass-surface tw:p-6">
                      <span className="tw:relative tw:z-10 tw:grid tw:size-10 tw:place-items-center tw:rounded-full tw:border tw:border-primary/40 tw:bg-background tw:font-mono tw:text-xs tw:text-primary">
                        {item.step}
                      </span>
                      <div className="tw:flex tw:flex-col tw:gap-3">
                        <h3 className="tw:text-lg tw:font-bold">{item.title}</h3>
                        <p className="tw:text-sm tw:leading-6 tw:text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  </MotionReveal>
                ))}
              </ol>
            </div>
          </section>

          <section id="contact" aria-labelledby="contact-title" className="tw:py-24 tw:sm:py-32">
            <MotionReveal>
              <div className="tw:relative tw:overflow-hidden tw:rounded-4xl tw:border tw:glass-surface tw:px-6 tw:py-14 tw:sm:px-10 tw:sm:py-20 tw:lg:px-16">
                <div
                  aria-hidden="true"
                  className="tw:absolute tw:top-1/2 tw:-right-24 tw:size-80 tw:-translate-y-1/2 tw:rounded-full tw:border tw:border-primary/20"
                />
                <div
                  aria-hidden="true"
                  className="tw:absolute tw:top-1/2 tw:-right-10 tw:size-52 tw:-translate-y-1/2 tw:rounded-full tw:border tw:border-trust/15"
                />
                <div className="tw:relative tw:flex tw:max-w-3xl tw:flex-col tw:items-start tw:gap-7">
                  <p className="tw:font-mono tw:text-xs tw:tracking-[0.22em] tw:text-primary tw:uppercase">
                    Your project / next case file
                  </p>
                  <h2
                    id="contact-title"
                    className="tw:text-4xl tw:leading-[1.02] tw:font-extrabold tw:tracking-[-0.045em] tw:text-balance tw:sm:text-5xl tw:lg:text-6xl"
                  >
                    If the project matters, start with clarity.
                  </h2>
                  <p className="tw:max-w-2xl tw:text-lg tw:leading-8 tw:text-muted-foreground">
                    Bring the brief, the pressure, and the unknowns. I’ll help turn them into a
                    product plan people can trust and a build that earns that trust.
                  </p>
                  <div className="tw:flex tw:flex-col tw:gap-3 tw:sm:flex-row">
                    <a
                      href={siteConfig.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({ size: "lg" })}
                    >
                      Start with my public work
                      <ArrowUpRight data-icon="inline-end" />
                    </a>
                    <a href="#top" className={buttonVariants({ size: "lg", variant: "outline" })}>
                      Back to the brief
                    </a>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </section>
        </main>

        <footer className="tw:flex tw:flex-col tw:items-start tw:gap-5 tw:border-t tw:border-border tw:py-8 tw:text-sm tw:text-muted-foreground tw:sm:flex-row tw:sm:items-center tw:sm:justify-between">
          <p>© 2026 Mahdi Rashidi. Built to make the work inspectable.</p>
          <div className="tw:flex tw:items-center tw:gap-5">
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="tw:rounded-sm tw:transition-colors tw:hover:text-foreground tw:focus-visible:ring-3 tw:focus-visible:ring-ring/35 tw:focus-visible:outline-none"
            >
              GitHub
            </a>
            <a
              href="#top"
              className="tw:rounded-sm tw:transition-colors tw:hover:text-foreground tw:focus-visible:ring-3 tw:focus-visible:ring-ring/35 tw:focus-visible:outline-none"
            >
              Top
            </a>
          </div>
        </footer>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </MotionProvider>
  );
}
