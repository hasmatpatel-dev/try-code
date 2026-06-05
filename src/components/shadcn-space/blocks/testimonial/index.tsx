"use client";

import { useState, useCallback } from "react";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
  logoLight: string;
  logoDark: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "TryCode replaced boring online coding lectures and static slides. Now our engineers write cleaner code, debug quickly, and build full-stack projects with ease. A genuine game-changer.",
    author: "Walter Dutcher",
    role: "CEO",
    company: "Gumroad",
    image: "https://images.shadcnspace.com/assets/hero-img/hero-team-img-4.jpg",
    logoLight: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-1.svg",
    logoDark: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-1.svg",
  },
  {
    quote:
      "TryCode offers hands-on coding challenges and smart AI debugging tutorials. Our students learn faster, build real portfolios, and we place skilled graduates in junior roles in weeks.",
    author: "Errica Mcdowell",
    role: "Marketing Head",
    company: "Notion",
    image: "https://images.shadcnspace.com/assets/hero-img/hero-team-img-8.jpg",
    logoLight: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-2.svg",
    logoDark: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-2.svg",
  },
  {
    quote:
      "We evaluated multiple learning platforms but TryCode stood out immediately. The project-based curriculum and AI feedback loop helped our team ship production features 40% faster.",
    author: "Jenny Wilson",
    role: "CTO",
    company: "Linear",
    image: "https://images.shadcnspace.com/assets/hero-img/hero-team-img-10.jpg",
    logoLight: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-3.svg",
    logoDark: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-3.svg",
  },
  {
    quote:
      "One of the most reliable platforms we adopted for developer upskilling. The integrations are seamless, the courses are deep, and it saves our engineering team countless hours every week.",
    author: "Linda Carter",
    role: "Head of Engineering",
    company: "Stripe",
    image: "https://images.shadcnspace.com/assets/hero-img/hero-team-img-6.jpg",
    logoLight: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-4.svg",
    logoDark: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-4.svg",
  },
];

export default function Testimonial01() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const t = testimonials[current];

  return (
    <section className="overflow-hidden">
      {/* Heading */}
      <div className="max-w-7xl px-4 lg:px-8 xl:px-16 mx-auto w-full">
        <div className="py-4 sm:py-10 lg:py-20 px-8 lg:px-12 border-x border-border">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
            Students see{" "}
            <span className="bg-[linear-gradient(90deg,var(--foreground)_-20%,#3B82F6_94.54%,#FFFFFF_104.51%)] bg-clip-text text-transparent">
              instant results
            </span>
          </h2>
        </div>
      </div>

      {/* Carousel slide */}
      <div className="max-w-7xl px-4 lg:px-8 xl:px-16 mx-auto w-full h-full">
        <div className="border border-border">
          <div
            key={current}
            className="flex flex-col lg:flex-row h-full items-stretch animate-in fade-in duration-500"
          >
            {/* Portrait */}
            <div className="relative w-full h-72 sm:h-[32rem] lg:h-auto lg:w-[26rem] shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.image}
                alt={t.author}
                width={1280}
                height={720}
                className="w-full h-full object-cover object-[center_20%] sm:object-[center_30%]"
              />
            </div>

            {/* Content */}
            <div className="p-6 md:p-12 flex flex-col justify-between h-auto gap-12">
              <p className="text-2xl md:text-3xl font-medium text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xl sm:text-2xl font-medium text-foreground">{t.author}</p>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    {t.role} @ {t.company}
                  </p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.logoLight}
                  alt={t.company}
                  width={130}
                  height={52}
                  className="dark:hidden"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.logoDark}
                  alt={t.company}
                  width={130}
                  height={52}
                  className="hidden dark:block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="max-w-7xl px-4 lg:px-8 xl:px-16 mx-auto w-full">
        <div className="border-x border-border py-10 xl:px-16 lg:px-8 px-4">
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  current === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}