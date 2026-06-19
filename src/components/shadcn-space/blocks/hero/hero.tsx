"use client";

import { Instrument_Serif } from "next/font/google";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export type AvatarList = {
  image: string;
};

type HeroSectionProps = {
  avatarList: AvatarList[];
};

function HeroSection({ avatarList }: HeroSectionProps) {
  return (
    <div className="w-full h-full relative">
      <div className="relative w-full pt-16 md:pt-20 pb-10 md:pb-20 px-4 md:px-8 before:absolute before:left-0 before:right-0 before:w-full before:h-full before:bg-linear-to-r before:from-sky-100 before:via-white before:to-amber-100 before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-slate-800 dark:before:via-black dark:before:to-stone-700 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10">
        <div className="relative z-10 flex flex-col max-w-5xl mx-auto gap-8">
          <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
            <h1 className="lg:text-8xl md:text-7xl text-4xl font-medium leading-14 md:leading-20 lg:leading-24">
              Modern Skills for{" "} <br />
              <span
                className={`${instrumentSerif.className} tracking-tight`}
              >
                Modern Developers.
              </span>
            </h1>
            <p className="text-base font-normal max-w-2xl text-muted-foreground leading-relaxed">
              Master AI, React, Next.js, WordPress, Elementor, ACF Pro, Webflow, Framer, Testing, Performance, and Architecture through structured roadmaps, practical recipes, curated resources, and AI-powered guidance.
            </p>
          </div>
          <div className="flex items-center flex-col sm:flex-row justify-center gap-6">
            <Link 
              href="#roadmaps"
              className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 flex items-center cursor-pointer select-none"
            >
              <span className="relative z-10 transition-all duration-500">
                Explore Roadmaps
              </span>
              <span className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
