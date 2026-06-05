"use client";

import { motion } from "motion/react";
import ReminderAnimation from "@/components/shadcn-space/blocks/bento-grid-01/ReminderAnimation";
import AnimatedUiBlock from "@/components/shadcn-space/blocks/bento-grid-01/AnimatedUiBlock";

const Bentogrid = () => {
  return (
    <section>
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
        
      </div>

      {/* Grid container */}
      <div className="border-y border-border">
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border px-5 md:px-8 py-8 md:py-16">
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex gap-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <p className="text-base text-muted-foreground font-normal">Bento Grid Features</p>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
                AI coding platform built for{" "}
                <span className="bg-[linear-gradient(90deg,var(--foreground)_-20%,#3B82F6_94.54%,#FFFFFF_104.51%)] bg-clip-text text-transparent">
                  learning web development
                </span>
              </h2>
            </motion.div>
          </div>
          
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
                    Learn Next.js & React
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Hands-on coding lessons targeting the modern React ecosystem
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="lg:col-span-8 col-span-12 overflow-hidden border-b border-border flex flex-col justify-between">
                <div className="bg-muted py-7 lg:px-30 px-6 relative flex-1 flex items-center justify-center">
                  <AnimatedUiBlock />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border bg-background">
                  <h3 className="text-xl font-medium text-foreground">
                    Interactive Coding Practice
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Solve coding challenges online using our custom AI compiler and tutorial guide. Whether you are learning basic algorithms, full-stack frameworks, or databases.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="lg:col-span-4 col-span-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between">
                <div className="p-8 bg-muted flex-1 flex items-center justify-center">
                  <img
                    src="https://images.shadcnspace.com/assets/bento-grid/bento-grid-img-1.png"
                    alt="layout options"
                    className="dark:hidden"
                  />
                  <img
                    src="https://images.shadcnspace.com/assets/bento-grid/bento-grid-darkimg-1.png"
                    alt="layout options"
                    className="hidden dark:block"
                  />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border bg-background flex-none">
                  <h3 className="text-xl font-medium text-foreground">
                    Job-Ready Career Growth
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    We provide portfolio reviews and resume builders to land tech jobs fast.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="lg:col-span-4 col-span-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between">
                <div className="p-8 bg-muted flex-1 flex items-center justify-center">
                  <img
                    src="https://images.shadcnspace.com/assets/bento-grid/bento-grid-img-2.png"
                    alt="documentation"
                    className="dark:hidden"
                  />
                  <img
                    src="https://images.shadcnspace.com/assets/bento-grid/bento-grid-darkimg-2.png"
                    alt="documentation"
                    className="hidden dark:block"
                  />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border bg-background flex-none">
                  <h3 className="text-xl font-medium text-foreground">
                    Expert Mentors
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    A friendly and easy-to-reach developer community for your career.
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="lg:col-span-4 col-span-12 overflow-hidden flex flex-col justify-between">
                <div className="p-8 bg-muted flex-1 flex items-center justify-center relative">
                  <img
                    src="https://images.shadcnspace.com/assets/bento-grid/bento-grid-img-3.png"
                    alt="color options"
                  />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border bg-background flex-none">
                  <h3 className="text-xl font-medium text-foreground">
                    Flexible Study Plan
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Self-paced learning plans to complete lessons according to your schedule.
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
