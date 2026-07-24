import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/base/badge";
import { buttonVariants } from "@/components/base/button";
import { ContactForm } from "@/components/contact/contact-form";
import {
  ArchitectureBackdrop,
  HeroEntrance,
  MotionProvider,
  MotionReveal,
  ScrollProgress,
} from "@/components/landing/motion";
import { SiteHeader } from "@/components/landing/site-header";
import { siteConfig } from "@/lib/site";

const pageDescription =
  "Share your full-stack project brief with Mahdi Rashidi and choose the most comfortable way to continue the conversation.";

export const metadata: Metadata = {
  title: "Contact",
  description: pageDescription,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact Mahdi Rashidi about your project",
    description: pageDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Mahdi Rashidi about your project",
    description: pageDescription,
  },
};

const contactSteps = [
  {
    title: "Outline the useful context",
    description: "Name the product, its audience, the current pressure, and the outcome you need.",
  },
  {
    title: "Choose where I should reply",
    description: "Use email, phone, Telegram, or Instagram—whichever is easiest for you.",
  },
  {
    title: "Review before anything leaves",
    description: "Your email app opens with the brief prepared. You stay in control of sending it.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Mahdi Rashidi",
  url: new URL("/contact", siteConfig.url).href,
  description: pageDescription,
  mainEntity: {
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url.href,
    jobTitle: "Full-Stack Developer",
  },
};

export default function ContactPage() {
  return (
    <MotionProvider>
      <ScrollProgress />
      <ArchitectureBackdrop />

      <div className="tw:relative tw:z-10 tw:mx-auto tw:flex tw:min-h-screen tw:w-full tw:max-w-7xl tw:flex-col tw:px-4 tw:pb-8 tw:sm:px-6 tw:lg:px-8">
        <SiteHeader activePage="contact" />

        <main className="tw:flex-1">
          <section
            aria-labelledby="contact-page-title"
            className="tw:grid tw:gap-14 tw:py-16 tw:sm:py-24 tw:lg:grid-cols-[0.82fr_1.18fr] tw:lg:items-start tw:lg:gap-20 tw:lg:py-28"
          >
            <div className="tw:flex tw:flex-col tw:gap-10 tw:lg:sticky tw:lg:top-32">
              <HeroEntrance>
                <div className="tw:flex tw:flex-col tw:items-start tw:gap-7">
                  <Badge variant="outline">Project intake · clear and private</Badge>
                  <div className="tw:flex tw:flex-col tw:gap-5">
                    <p className="tw:font-mono tw:text-xs tw:font-medium tw:tracking-[0.22em] tw:text-primary tw:uppercase">
                      Your project / first useful conversation
                    </p>
                    <h1
                      id="contact-page-title"
                      className="tw:text-[clamp(3rem,7vw,5.8rem)] tw:leading-[0.95] tw:font-extrabold tw:tracking-[-0.06em] tw:text-balance"
                    >
                      Bring the brief. <span className="tw:text-primary">Keep the unknowns.</span>
                    </h1>
                  </div>
                  <p className="tw:max-w-xl tw:text-lg tw:leading-8 tw:text-muted-foreground">
                    Tell me what you are building, why it matters now, and where you would like the
                    conversation to continue. A rough but honest summary is enough to begin.
                  </p>
                </div>
              </HeroEntrance>

              <MotionReveal delay={0.12}>
                <ol className="tw:flex tw:flex-col tw:gap-6 tw:border-s tw:border-border tw:ps-6">
                  {contactSteps.map((step, index) => (
                    <li key={step.title} className="tw:relative tw:flex tw:flex-col tw:gap-2">
                      <span className="tw:absolute tw:-start-[2.05rem] tw:top-1 tw:grid tw:size-4 tw:place-items-center tw:rounded-full tw:border tw:border-primary/50 tw:bg-background tw:font-mono tw:text-[0.5rem] tw:text-primary">
                        {index + 1}
                      </span>
                      <h2 className="tw:text-base tw:font-bold">{step.title}</h2>
                      <p className="tw:max-w-md tw:text-sm tw:leading-6 tw:text-muted-foreground">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </MotionReveal>
            </div>

            <MotionReveal delay={0.18} distance={22}>
              <ContactForm />
            </MotionReveal>
          </section>
        </main>

        <footer className="tw:flex tw:flex-col tw:items-start tw:gap-4 tw:border-t tw:border-border tw:py-8 tw:text-sm tw:text-muted-foreground tw:sm:flex-row tw:sm:items-center tw:sm:justify-between">
          <p>Your brief stays yours until you choose to send it.</p>
          <Link href="/" className={buttonVariants({ size: "sm", variant: "ghost" })}>
            Return to portfolio
          </Link>
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
