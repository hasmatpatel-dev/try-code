"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type PricingPlan = {
  plan_name: string;
  plan_descp: string;
  monthly_price: number;
  annual_price: number;
  plan_feature: string[];
  plan_popular: boolean;
  cta_label: string;
  cta_href: string;
};

const pricingData: PricingPlan[] = [
  {
    plan_name: "Starter Plan",
    plan_descp: "For individuals, self-taught learners, and beginners.",
    monthly_price: 25,
    annual_price: 20,
    plan_feature: [
      "Access to introductory coding courses",
      "Interactive code playground & compiler",
      "Regular weekly lesson updates",
      "Community forum access",
      "Certificate of basic completion",
    ],
    plan_popular: false,
    cta_label: "Get Starter Plan",
    cta_href: "/auth/sign-up",
  },
  {
    plan_name: "Growth Plan",
    plan_descp: "For growing developers and bootcamp students.",
    monthly_price: 199,
    annual_price: 159,
    plan_feature: [
      "Everything in Starter",
      "Advanced Full Stack courses",
      "Access to real-world projects",
      "Private mentor channel access",
      "Priority support",
      "Monthly code reviews",
    ],
    plan_popular: true,
    cta_label: "Start Growth Plan",
    cta_href: "/auth/sign-up",
  },
  {
    plan_name: "Enterprise Plan",
    plan_descp: "For teams, companies, and career-changers.",
    monthly_price: 499,
    annual_price: 399,
    plan_feature: [
      "Everything in Growth",
      "Unlimited one-on-one coaching",
      "Priority job placement support",
      "Custom portfolio project reviews",
      "Mock interview preparation",
      "Dedicated account manager",
    ],
    plan_popular: false,
    cta_label: "Get Enterprise Plan",
    cta_href: "/auth/sign-up",
  },
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="relative bg-background overflow-hidden">
      {/* Radial gradient glow */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[12%] translate-y-1/3 w-[42rem] h-[36rem] bg-[radial-gradient(100%_100%_at_50%_0%,rgba(41,126,255,0.5)_9.13%,rgba(56,189,248,0.5)_100%)] blur-[100px] rounded-full pointer-events-none" />

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
        <div className="border-x border-border px-8 py-8 md:py-16">
          <motion.div
            className="flex flex-col gap-2 sm:gap-4 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-foreground">Pricing</p>
            <div className="flex flex-wrap gap-12 items-end justify-between">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal text-foreground max-w-md tracking-tight">
                Start free{" "}
                <span className="text-foreground/50">Upgrade to scale</span>
              </h2>

              {/* Billing toggle */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="billing"
                    className={cn(
                      "text-base font-normal cursor-pointer transition-colors",
                      !isAnnual ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    Monthly
                  </Label>
                  <Switch
                    id="billing"
                    checked={isAnnual}
                    onCheckedChange={setIsAnnual}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor="billing"
                    className={cn(
                      "text-base font-normal cursor-pointer transition-colors",
                      isAnnual ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    Annual
                  </Label>
                </div>
                <Badge variant="outline" className="text-sm font-normal h-auto">
                  SAVE 20%
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing cards grid */}
      <div className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {pricingData.map((plan, index) => (
                <motion.div
                  key={plan.plan_name}
                  className="flex flex-col border-border bg-muted/10 lg:odd:bg-muted/20 lg:even:bg-muted/10 border-b last:border-b-0 md:even:border-r-0 md:border-r lg:border-r lg:last:border-r-0 lg:border-b-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
                >
                  {/* Plan header */}
                  <div className="px-8 xl:px-16 py-6 xl:py-12 flex flex-col gap-10 border-b border-border">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-medium text-foreground">
                          {plan.plan_name}
                        </p>
                        {plan.plan_popular && (
                          <Badge variant="outline" className="text-sm font-normal h-auto">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg font-normal text-muted-foreground">
                        {plan.plan_descp}
                      </p>
                    </div>

                    {/* Price */}
                    <p className="text-6xl font-medium text-foreground">
                      $
                      <span>
                        {isAnnual ? plan.annual_price : plan.monthly_price}
                      </span>
                      <span className="text-base font-normal ml-1.5 text-muted-foreground">
                        /{isAnnual ? "mo, billed annually" : "month"}
                      </span>
                    </p>
                  </div>

                  {/* Features + CTA */}
                  <div className="px-8 xl:px-16 py-8 xl:py-12 flex flex-col flex-1 justify-between gap-12">
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
