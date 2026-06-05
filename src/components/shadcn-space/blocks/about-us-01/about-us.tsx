"use client"

import { cn } from "@/lib/utils";
import { LucideIcon, Plus } from "lucide-react";
import { Instrument_Serif } from "next/font/google";
import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useInView } from "motion/react";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

type aboutusData = {
  icon: LucideIcon;
  title: string;
  color: string;
}[];

type statisticsCounter = {
  title: string;
  count: number;
}[];

const AnimatedCounter = ({
  value,
  isInView,
}: {
  value: number;
  isInView: boolean;
}) => {
  const springValue = useSpring(0, {
    bounce: 0,
    duration: 2000,
  });

  const displayValue = useTransform(springValue, (current) =>
    Math.round(current)
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  return <motion.span>{displayValue}</motion.span>;
};

const AboutUs = ({
  aboutusData,
  statisticsCounter,
}: {
  aboutusData: aboutusData;
  statisticsCounter: statisticsCounter;
}) => {
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, margin: "-100px" });

  return (
    <section>
      {/* Heading */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border px-5 md:px-8 py-12 lg:py-16">
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="flex flex-col items-start justify-center gap-6"
            >
              <div className="flex gap-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <p className="text-base text-muted-foreground font-normal">About Us</p>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground tracking-tight max-w-5xl leading-tight text-left">
                Providing interactive, AI-powered & hands-on programming
                courses to accelerate developer career growth with
              </h2>
              <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-4">
                {aboutusData.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-3 px-6 py-2 rounded-full",
                      item.color
                    )}
                  >
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                    <span
                      className={cn(
                        "text-4xl font-normal",
                        instrumentSerif.className
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Counters Grid */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 xl:px-16">
        <div className="border-t border-x border-border">
          <div
            ref={statsRef}
            id="awards"
            className="w-full grid grid-cols-1 sm:grid-cols-3 scroll-mt-20"
          >
            {statisticsCounter?.map((value, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    "relative px-6 py-10 sm:py-16 gap-3 flex flex-col items-center justify-center text-center",
                    index < statisticsCounter.length - 1 ? "border-b sm:border-b-0 sm:border-r border-border" : ""
                  )}
                >
                  <div className="flex gap-0 sm:gap-2 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium">
                    <Plus
                      strokeWidth={3.5}
                      className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                    />
                    <AnimatedCounter
                      value={value.count}
                      isInView={isInView}
                    />
                  </div>
                  <p className="text-base font-normal text-muted-foreground text-center">
                    {value.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
