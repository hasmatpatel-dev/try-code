"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "motion/react";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ResourcePlan = {
  plan_name: string;
  plan_descp: string;
  price_label: string;
  plan_feature: string[];
  plan_popular: boolean;
  cta_label: string;
  cta_href: string;
};

const resourceData: ResourcePlan[] = [
  {
    plan_name: "Curated Resources",
    plan_descp: "Learn with the best handpicked educational guides.",
    price_label: "100+ Guides",
    plan_feature: [
      "YouTube Playlists",
      "Official Documentation",
      "AI Prompts Matrix",
      "Boilerplates & Configs",
      "Starter Templates",
      "Development Checklists",
      "Interactive Cheat Sheets",
    ],
    plan_popular: false,
    cta_label: "Explore Resources",
    cta_href: "#recipes",
  },
  {
    plan_name: "Modern Dev Tools",
    plan_descp: "Build with the stack preferred by industry leaders.",
    price_label: "11+ Stack Tools",
    plan_feature: [
      "React & Next.js App Router",
      "Supabase DB & Auth",
      "WordPress & Elementor",
      "ACF Pro & CPT UI",
      "Webflow & Framer",
      "Playwright & Vitest",
      "Figma UI/UX Designs",
    ],
    plan_popular: true,
    cta_label: "Explore Tools",
    cta_href: "#categories",
  },
  {
    plan_name: "AI Code Mentor",
    plan_descp: "Get instant code solutions and debugging guidance.",
    price_label: "24/7 Access",
    plan_feature: [
      "Hydration error solver",
      "Next.js Server Action secure helper",
      "WordPress custom loop generator",
      "Vitest and Playwright test compiler",
      "Performance optimization checklist",
      "AI prompt engineering guidelines",
    ],
    plan_popular: false,
    cta_label: "Try AI Mentor",
    cta_href: "#ai-mentor",
  },
];

const Pricing = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} id="resources" className="relative bg-background overflow-hidden">
      {/* Radial gradient glow */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[12%] translate-y-1/3 w-[42rem] h-[36rem] bg-[radial-gradient(100%_100%_at_50%_0%,rgba(147,51,234,0.15)_9.13%,rgba(99,102,241,0.15)_100%)] blur-[100px] rounded-full pointer-events-none" />

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
        <div className="border-x border-border px-5 md:px-8 py-8 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground m-1.5" />
                <span className="text-base font-normal text-muted-foreground">
                  Resources & Tools
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-foreground">
                Resources.
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Resource cards grid */}
      <div className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {resourceData.map((plan, index) => (
                <div
                  key={plan.plan_name}
                  className="flex flex-col border-border bg-muted/10 lg:odd:bg-muted/20 lg:even:bg-muted/10 border-b last:border-b-0 md:even:border-r-0 md:border-r lg:border-r lg:last:border-r-0 lg:border-b-0"
                >
                  {/* Card header */}
                  <div className="px-6 sm:px-8 xl:px-16 py-6 xl:py-12 flex flex-col gap-8 sm:gap-10 border-b border-border">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-medium text-foreground">
                          {plan.plan_name}
                        </p>
                      </div>
                      <p className="text-lg font-normal text-muted-foreground">
                        {plan.plan_descp}
                      </p>
                    </div>

                    {/* Badge details */}
                    <p className="text-4xl font-medium text-foreground">
                      {plan.price_label}
                    </p>
                  </div>

                  {/* Features + CTA */}
                  <div className="px-6 sm:px-8 xl:px-16 py-6 sm:py-8 xl:py-12 flex flex-col flex-1 justify-between gap-8 sm:gap-12">
                    <ul className="flex flex-col gap-2">
                      {plan.plan_feature.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <Check
                            size={20}
                            className="text-muted-foreground/80 shrink-0"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={plan.cta_href}
                      className={cn(
                        "w-full py-3.5 text-sm font-medium text-center rounded-full transition-colors cursor-pointer inline-block",
                        plan.plan_popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border bg-background text-foreground hover:bg-muted"
                      )}
                    >
                      {plan.cta_label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
