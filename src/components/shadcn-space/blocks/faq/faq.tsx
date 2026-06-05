"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

const FAQ_DATA = [
  {
    question: "What courses does TryCode offer?",
    answer:
      "We provide interactive classes on JavaScript, React, Next.js, TypeScript, MERN and PERN stack, database design with Supabase, and AI coding tools.",
  },
  {
    question: "Do I need prior coding experience?",
    answer:
      "Not at all! Our courses are built to take you from absolute beginner to job-ready software engineer step by step.",
  },
  {
    question: "Is there a free trial option available?",
    answer:
      "Yes, you can register and try our introductory programming labs for free before upgrading to a paid plan.",
  },
  {
    question: "Do you offer job placement support?",
    answer:
      "Yes! We provide resume reviews, career coaching, mock interview prep, and direct job placement assistance on our Bootcamp and Enterprise tiers.",
  },
  {
    question: "Can I learn AI development here?",
    answer:
      "Absolutely! We offer specialized courses on building AI agents, using OpenAI APIs, and integrating machine learning tools in full-stack web applications.",
  },
  {
    question: "How much do the courses cost?",
    answer:
      "Our Starter plan begins at $25/month. Growth (Bootcamp) is $199/month and Enterprise is $499/month. Annual billing saves you 20% across all tiers.",
  },
];

const STATS = [
  { value: "10K+", label: "Students enrolled" },
  { value: "50+", label: "Expert courses" },
  { value: "98%", label: "Satisfaction rate" },
  { value: "95%", label: "Job placement rate" },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section>
      <div className="overflow-hidden">

        {/* Heading */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border px-5 md:px-8 py-8 md:py-16">
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground m-1.5" />
                <span className="text-base font-normal text-muted-foreground">Know us better</span>
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-foreground">FAQs.</h2>
            </motion.div>
          </div>
        </div>

        {/* Image + Accordion */}
        <div className="border-y border-border">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
            <div className="border-x border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2">

                {/* Left — image */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.shadcnspace.com/assets/backgrounds/faq-3.webp"
                    alt="TryCode FAQ"
                    width={564}
                    height={536}
                    className="w-full h-auto object-cover max-h-[48rem]"
                  />
                </motion.div>

                {/* Right — accordion */}
                <div className="w-full flex flex-col">
                  {FAQ_DATA.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                      <motion.div
                        key={index}
                        className={`px-4 py-6 sm:p-6 flex flex-col gap-2 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both ${
                          index < FAQ_DATA.length - 1 ? "border-b border-border" : ""
                        }`}
                        style={{ animationDelay: `${(index + 1) * 100}ms` }}
                      >
                        <button
                          type="button"
                          onClick={() => toggle(index)}
                          aria-expanded={isOpen}
                          className="flex flex-1 items-center justify-between text-left text-lg font-medium cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-lg transition-all p-0 group/trigger"
                        >
                          {faq.question}
                          <Plus
                            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                            aria-hidden="true"
                          />
                        </button>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="text-base font-normal text-muted-foreground overflow-hidden"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`px-2.5 py-12 md:py-16 border-border flex flex-col gap-2 items-center justify-center text-center ${
                    index < STATS.length - 1 ? "border-r border-border" : ""
                  } ${index < 2 ? "border-b lg:border-b-0" : ""}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                >
                  <h3 className="text-5xl font-semibold text-foreground">{stat.value}</h3>
                  <p className="text-lg font-normal text-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
