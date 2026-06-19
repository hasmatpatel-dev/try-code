"use client";

const ITEMS = [
  "TryCode",
  "Full-Stack Blog CMS & LMS",
  "TryCode",
  "Structured Roadmaps",
  "TryCode",
  "Full-Stack Blog CMS & LMS",
  "TryCode",
  "Practical Recipes",
  "TryCode",
  "Full-Stack Blog CMS & LMS",
  "TryCode",
  "AI Mentor",
];

export default function MarqueeBanner() {
  return (
    <div
      role="region"
      aria-label="Highlights Marquee"
      className="w-full bg-[#0a0a0a] text-white border-b border-white/10 py-2.5 z-40 relative"
      style={{ overflow: "hidden" }}
    >
      {/* Fade masks on edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          left: 0,
          zIndex: 2,
          width: "60px",
          background: "linear-gradient(to right, #0a0a0a, transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          right: 0,
          left: "auto",
          zIndex: 2,
          width: "60px",
          background: "linear-gradient(to left, #0a0a0a, transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Scrolling track */}
      <div
        className="tc-marquee-track"
        style={{
          display: "flex",
          width: "max-content",
          animation: "tc-marquee 35s linear infinite",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      >
        {[...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "0 16px",
              whiteSpace: "nowrap",
              fontSize: "12px",
              letterSpacing: "0.05em",
            }}
          >
            {item === "TryCode" ? (
              <strong style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {item}
              </strong>
            ) : (
              <span style={{ fontWeight: 400, opacity: 0.55 }}>{item}</span>
            )
            /* Mark duplicate entries aria-hidden if redundant, but here standard inline structure */
            }
            <span style={{ opacity: 0.2, fontSize: "8px" }}>◆</span>
          </span>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes tc-marquee {
              0%   { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            @media (prefers-reduced-motion: reduce) {
              .tc-marquee-track {
                animation: none !important;
                overflow-x: auto !important;
                display: inline-flex !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
