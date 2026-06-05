"use client";
import AboutUs from "@/components/shadcn-space/blocks/about-us/about-us";
import { Target, WandSparkles, Zap } from "lucide-react";

const aboutusData = [
    {
      icon: WandSparkles,
      title: "Interactive",
      color: "bg-blue-400/10 text-blue-400"
    },
    {
      icon: Zap,
      title: "AI-Guidance",
      color: "bg-teal-400/10 text-teal-400" 
    },
    {
      icon: Target,
      title: "Bootcamp",
      color: "bg-orange-400/10 text-orange-400" 
    }
];

const statisticsCounter = [
    {
        title: "Completed Code Projects",
        count: 40
    },
    {
        title: "Programming Courses",
        count: 15
    },
    {
        title: "Career Mentors",
        count: 12
    },
]

const AboutAndStats01 = () => {
  return (
    <>
      <AboutUs aboutusData={aboutusData} statisticsCounter={statisticsCounter} />
    </>
  );
};

export default AboutAndStats01;
