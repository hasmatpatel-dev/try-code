"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="overflow-hidden border-y border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
        <div
          className="w-full h-auto border-x border-border"
        >
          <div className="relative px-6 py-24 sm:py-40 lg:px-8 text-center overflow-hidden">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">

              {/* Heading */}
              <motion.h2
                className="text-3xl sm:text-4xl md:text-6xl font-medium text-white md:leading-none"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                Start your{" "}
                <span className="bg-[linear-gradient(90deg,#FFFFFF_-20%,#3B82F6_94.54%,#FFFFFF_104.51%)] bg-clip-text text-transparent">
                  Coding Career
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-lg text-white/50 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              >
                Learn full stack development through interactive courses, real-world projects, and AI-powered guidance — and land your first software engineering job.
              </motion.p>

              {/* Animated border button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                <div className="w-fit h-fit relative inline-flex overflow-hidden p-px rounded-xl">
                

                  <Link
                      href="/auth/sign-up"
                      className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden bg-primary text-primary-foreground hover:bg-primary/80 inline-flex items-center"
                    >
                      <span className="relative z-10 transition-all duration-500">Get Started</span>
                      <div className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </div>
                    </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
