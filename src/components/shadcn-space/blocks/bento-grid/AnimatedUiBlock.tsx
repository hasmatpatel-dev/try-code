"use client";
import { motion } from "motion/react";
import { CircleCheck, Wind, FileCode2, Zap } from "lucide-react";

const FEATURES = [
  { label: "Routing Setup" },
  { label: "Layout System" },
  { label: "Markdown Support" },
  { label: "Dark Mode" },
  { label: "Utility Styling", highlight: true },
  { label: "SEO Defaults" },
  { label: "404 Page" },
  { label: "GitHub Links" },
  { label: "Deployment" },
];

function FeatureBadge({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
        highlight
          ? "border border-blue-500 bg-background text-blue-500"
          : "bg-muted text-muted-foreground border border-transparent"
      }`}
    >
      <CircleCheck
        size={14}
        className={highlight ? "fill-blue-500 stroke-background" : "fill-foreground/20 stroke-muted"}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

export default function AnimatedUiBlock() {
  return (
    <div className="w-full h-full flex items-center justify-center py-4 px-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full max-w-2xl">

        {/* Left — two stacked cards */}
        <div className="flex flex-col gap-3 h-full">
          {/* Card: Built with Tailwind */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 rounded-xl bg-card ring-1 ring-foreground/10 shadow-xs py-6 px-6 flex flex-col gap-4"
          >
            <div className="size-8 flex items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
              <Wind size={18} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">Built with Tailwind</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fully customizable styling with utility-first CSS.
              </p>
            </div>
          </motion.div>

          {/* Card: Write in MDX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 rounded-xl bg-card ring-1 ring-foreground/10 shadow-xs py-6 px-6 flex flex-col gap-4"
          >
            <div className="size-8 flex items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <FileCode2 size={18} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">Write in MDX</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mix Markdown and JSX for expressive documentation.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right — large card with badges + fast setup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-xl bg-card ring-1 ring-foreground/10 shadow-xs overflow-hidden flex flex-col"
        >
          {/* Badge grid */}
          <div className="px-5 py-5 bg-sky-400/5 flex-1">
            <div className="flex flex-wrap gap-2">
              {FEATURES.map((f) => (
                <FeatureBadge key={f.label} label={f.label} highlight={f.highlight} />
              ))}
            </div>
          </div>

          {/* Fast Setup section */}
          <div className="px-5 py-5 border-t border-border flex flex-col gap-3">
            <div className="size-7 flex items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Zap size={16} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">Fast Setup</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get up and running in minutes with built-in routing, layouts, SEO, and styling—all preconfigured.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}