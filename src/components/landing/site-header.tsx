import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/base/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

const navigationItems = [
  { href: "/#trust", label: "How I work" },
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#experience", label: "Experience" },
  { href: "/#stack", label: "Stack" },
  { href: "/#proof", label: "Proof" },
] as const;

function SiteHeader({ activePage = "home" }: { activePage?: "home" | "contact" }) {
  const isContactPage = activePage === "contact";

  return (
    <header className="tw:sticky tw:top-4 tw:z-40 tw:mt-4 tw:flex tw:items-center tw:justify-between tw:gap-3 tw:rounded-2xl tw:border tw:glass-surface tw:px-4 tw:py-3 tw:sm:px-5">
      <Link
        href="/"
        aria-label="Mahdi Rashidi, home"
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
      </Link>

      <nav
        aria-label="Primary navigation"
        className="tw:hidden tw:items-center tw:gap-6 tw:md:flex"
      >
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="tw:rounded-sm tw:text-sm tw:text-muted-foreground tw:transition-colors tw:hover:text-foreground tw:focus-visible:ring-3 tw:focus-visible:ring-ring/35 tw:focus-visible:outline-none"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/contact"
          aria-current={isContactPage ? "page" : undefined}
          className={cn(
            "tw:rounded-sm tw:text-sm tw:transition-colors tw:focus-visible:ring-3 tw:focus-visible:ring-ring/35 tw:focus-visible:outline-none",
            isContactPage
              ? "tw:font-medium tw:text-primary"
              : "tw:text-muted-foreground tw:hover:text-foreground",
          )}
        >
          Contact
        </Link>
      </nav>

      <div className="tw:flex tw:items-center tw:gap-2">
        <Link
          href="/contact"
          aria-current={isContactPage ? "page" : undefined}
          className={buttonVariants({
            size: "sm",
            variant: isContactPage ? "secondary" : "outline",
            className: "tw:md:hidden",
          })}
        >
          Contact
        </Link>
        <a
          href={siteConfig.githubUrl}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            size: "sm",
            variant: "outline",
            className: "tw:hidden tw:sm:inline-flex",
          })}
        >
          GitHub
          <ArrowUpRight data-icon="inline-end" />
        </a>
      </div>
    </header>
  );
}

export { SiteHeader };
