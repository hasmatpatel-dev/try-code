"use client";
import Feature from "@/components/shadcn-space/blocks/feature-01/feature";
import { ArrowDownUp, BellRing, RotateCw, Tag } from "lucide-react"

const featureData = [
    {
      icon: ArrowDownUp,
      content: "Learn Programming Online with real-time feedback and smart AI guidance tools.",
    },
    {
      icon: BellRing,
      content: "Learn Full Stack Development Courses through interactive project building and review.",
    },
    {
      icon: RotateCw,
      content: "Take our TypeScript Course and JavaScript Training built for modern React frameworks.",
    },
    {
      icon: Tag,
      content: "Access our AI Developer Training to prepare for software engineering jobs fast.",
    },
];

const Feature01 = () => {
  return (
    <>
      <Feature featureData={featureData} />
    </>
  );
};

export default Feature01;
