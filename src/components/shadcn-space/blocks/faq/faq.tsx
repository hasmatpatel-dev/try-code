"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import Image from "next/image";

const FAQ_DATA = [
  {
    question: "Is Try-Code free?",
    answer:
      "Yes. The platform is free to access.",
  },
  {
    question: "Who is Try-Code for?",
    answer:
      "Developers, designers, and creators who want modern skills.",
  },
  {
    question: "What makes Try-Code different?",
    answer:
      "Roadmaps, Recipes, Resources, and AI Mentor combined in one platform.",
  },
  {
    question: "Can I use AI Mentor for coding help?",
    answer:
      "Yes. The AI Mentor is available 24/7 to help you explain concepts, write secure boilerplate blocks, and debug coding errors.",
  },
  {
    question: "Do I need prior experience?",
    answer:
      "No. However, many roadmaps target intermediate and advanced learners.",
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
                  <div className="relative w-full aspect-[564/536] max-h-[48rem] overflow-hidden rounded-2xl">
                    <Image
                      src="https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=575&h=450&fit=crop"
                      alt="TryCode FAQ"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
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
