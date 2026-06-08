"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import ReminderAnimation from "@/components/shadcn-space/blocks/bento-grid/ReminderAnimation";
import AnimatedUiBlock from "@/components/shadcn-space/blocks/bento-grid/AnimatedUiBlock";

const Bentogrid = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef}>
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
                  Why Try-Code
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-foreground">
                Why Try-Code.
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Grid container */}
      <div className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border">
            <motion.div
              className="grid grid-cols-12 gap-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Card 1 */}
              <div className="lg:col-span-4 col-span-12 overflow-hidden border-b lg:border-r border-border flex flex-col justify-between">
                <div className="bg-muted py-8 px-9 relative flex-1 flex items-center justify-center">
                  <ReminderAnimation />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border bg-background">
                  <h3 className="text-xl font-medium text-foreground">
                    Structured Roadmaps
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Follow a clear learning path.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="lg:col-span-8 col-span-12 overflow-hidden border-b border-border flex flex-col justify-between">
                <div className="bg-muted py-6 px-6 lg:px-10 relative flex-1 flex items-center justify-center min-h-[280px]">
                  <AnimatedUiBlock />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border bg-background">
                  <h3 className="text-xl font-medium text-foreground">
                    AI Mentor
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Get instant guidance directly from our context-aware assistant.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="lg:col-span-3 col-span-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between">
                <div className="p-8 bg-muted flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-16 flex items-center justify-center rounded-2xl bg-background border border-border shadow-sm">
                      <BookOpen size={32} className="text-foreground" />
                    </div>
                    <div className="flex gap-3">
                      {["React", "Next.js", "TS"].map((tag) => (
                        <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-background border border-border text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border bg-background flex-none">
                  <h3 className="text-xl font-medium text-foreground">
                    Practical Recipes
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Implement features quickly.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="lg:col-span-3 col-span-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between">
                <div className="p-8 bg-muted flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-16 flex items-center justify-center rounded-2xl bg-background border border-border shadow-sm">
                      <BookMarked size={32} className="text-foreground" />
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-[140px]">
                      {["Documentation", "Tutorials", "Videos"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="size-1.5 rounded-full bg-muted-foreground" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border bg-background flex-none">
                  <h3 className="text-xl font-medium text-foreground">
                    Curated Resources
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Best content in one place.
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="lg:col-span-3 col-span-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between">
                <div className="p-8 bg-muted flex-1 flex items-center justify-center relative">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-16 flex items-center justify-center rounded-2xl bg-background border border-border shadow-sm">
                      <Globe size={32} className="text-foreground" />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                      <div className="h-2 rounded-full bg-background border border-border w-full" />
                      <div className="h-2 rounded-full bg-background border border-border w-3/4" />
                      <div className="h-2 rounded-full bg-background border border-border w-5/6" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border bg-background flex-none">
                  <h3 className="text-xl font-medium text-foreground">
                    Real-World Learning
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Focus on practical skills.
                  </p>
                </div>
              </div>

              {/* Card 6 */}
              <div className="lg:col-span-3 col-span-12 overflow-hidden flex flex-col justify-between">
                <div className="p-8 bg-muted flex-1 flex items-center justify-center relative">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-16 flex items-center justify-center rounded-2xl bg-background border border-border shadow-sm">
                      <Zap size={32} className="text-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-background border border-border text-foreground">Free</span>
                      <span className="text-xs text-muted-foreground">Forever</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border bg-background flex-none">
                  <h3 className="text-xl font-medium text-foreground">
                    Free Platform
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Learn without subscriptions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bentogrid;
