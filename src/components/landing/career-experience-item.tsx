import { ArrowRight } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/card";
import { Badge } from "@/components/base/badge";

type CareerExperienceItemProps = {
  company: string;
  contributions: readonly string[];
  description: string;
  from: string;
  index: number;
  jobTitle: string;
  logo: string;
  technologies: readonly string[];
  to: string;
};

function CareerExperienceItem({
  company,
  contributions,
  description,
  from,
  index,
  jobTitle,
  logo,
  technologies,
  to,
}: CareerExperienceItemProps) {
  const recordNumber = String(index + 1).padStart(2, "0");

  return (
    <article className="tw:relative tw:grid tw:grid-cols-[2.75rem_minmax(0,1fr)] tw:gap-4 tw:sm:grid-cols-[3.5rem_minmax(0,1fr)] tw:sm:gap-6">
      <div className="tw:relative tw:flex tw:justify-center tw:pt-8" aria-hidden="true">
        <span className="tw:relative tw:z-10 tw:grid tw:size-9 tw:place-items-center tw:rounded-full tw:border tw:border-primary/40 tw:bg-background tw:font-mono tw:text-[0.65rem] tw:font-bold tw:text-primary tw:shadow-[0_0_24px_color-mix(in_srgb,var(--primary)_16%,transparent)]">
          {recordNumber}
        </span>
      </div>

      <Card className="tw:h-full">
        <CardHeader className="tw:gap-5">
          <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-4">
            <span
              aria-hidden="true"
              className="tw:grid tw:size-14 tw:shrink-0 tw:place-items-center tw:rounded-2xl tw:border tw:border-primary/30 tw:bg-primary/10 tw:font-mono tw:text-sm tw:font-extrabold tw:tracking-[0.08em] tw:text-primary"
            >
              {logo}
            </span>
            <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-1.5">
              <CardDescription>
                <span className="tw:font-mono tw:text-xs tw:font-medium tw:tracking-[0.14em] tw:text-primary tw:uppercase">
                  {company}
                </span>
              </CardDescription>
              <CardTitle>
                <h3 className="tw:text-xl tw:leading-tight tw:font-extrabold tw:tracking-[-0.025em] tw:sm:text-2xl">
                  {jobTitle}
                </h3>
              </CardTitle>
            </div>
          </div>

          <CardAction className="tw:static tw:col-auto tw:row-auto tw:justify-self-start tw:sm:col-start-2 tw:sm:row-start-1 tw:sm:justify-self-end">
            <div
              dir="ltr"
              className="tw:flex tw:items-center tw:gap-2 tw:font-mono tw:text-xs tw:text-muted-foreground"
              aria-label={`${from} to ${to}`}
            >
              <time>{from}</time>
              <ArrowRight aria-hidden="true" className="tw:size-3.5 tw:text-primary" />
              <time>{to}</time>
            </div>
          </CardAction>
        </CardHeader>

        <CardContent className="tw:flex tw:flex-col tw:gap-6">
          <p className="tw:max-w-3xl tw:text-base tw:leading-7 tw:text-muted-foreground">
            {description}
          </p>

          <div className="tw:flex tw:flex-col tw:gap-3">
            <h4 className="tw:font-mono tw:text-[0.65rem] tw:font-semibold tw:tracking-[0.16em] tw:text-foreground tw:uppercase">
              Key contributions
            </h4>
            <ul className="tw:grid tw:gap-2 tw:text-sm tw:leading-6 tw:text-muted-foreground">
              {contributions.map((contribution) => (
                <li key={contribution} className="tw:flex tw:gap-2">
                  <span
                    aria-hidden="true"
                    className="tw:mt-2 tw:size-1.5 tw:shrink-0 tw:rounded-full tw:bg-primary"
                  />
                  <span>{contribution}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="tw:flex-col tw:items-start tw:gap-4 tw:border-t tw:border-border/70 tw:pt-(--card-spacing)">
          <div className="tw:flex tw:flex-wrap tw:gap-2" aria-label="Technologies used">
            {technologies.map((technology) => (
              <Badge key={technology} variant="outline">
                {technology}
              </Badge>
            ))}
          </div>
          <p className="tw:font-mono tw:text-[0.65rem] tw:tracking-[0.16em] tw:text-muted-foreground tw:uppercase">
            Career record / {recordNumber}
          </p>
        </CardFooter>
      </Card>
    </article>
  );
}

export { CareerExperienceItem, type CareerExperienceItemProps };
