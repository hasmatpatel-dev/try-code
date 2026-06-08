"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

type ServiceItem = {
  number: string;
  title: string;
  description: string;
  image: string;
};

const serviceData: ServiceItem[] = [
  {
    number: "01",
    title: "AI-Powered Developer",
    description:
      "Master Prompt Engineering, AI Tools, AI Workflows, and AI Automation to accelerate your coding workflow.",
    image: "https://images.pexels.com/photos/1921326/pexels-photo-1921326.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    number: "02",
    title: "React Developer",
    description:
      "Deep dive into React Fundamentals, State Management, performance optimization, and integration testing.",
    image: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    number: "03",
    title: "Next.js Full Stack",
    description:
      "Build interactive products using React, Next.js App Router, secure Authentication, databases, and optimized Deployment.",
    image: "https://images.pexels.com/photos/14553720/pexels-photo-14553720.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    number: "04",
    title: "WordPress Professional",
    description:
      "Create high-performance client sites using WordPress, Elementor, ACF Pro, Custom Post Types (CPT UI), and dynamic layouts.",
    image: "https://images.pexels.com/photos/285814/pexels-photo-285814.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    number: "05",
    title: "Modern Web Creator",
    description:
      "Master UI/UX design, custom layouts in Webflow, Framer animations, and AI-assisted multimedia generation.",
    image: "https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    number: "06",
    title: "Software Architect",
    description:
      "Ensure quality at scale with end-to-end testing, page speed performance, system design architecture, and database scalability.",
    image: "https://images.pexels.com/photos/4425112/pexels-photo-4425112.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const Services = () => {
  return (
    <section id="roadmaps" className="border-y">
      {/* Heading */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 xl:px-16">
        <div className="border-x border-b px-4 md:px-8 py-12 lg:py-16 flex flex-col gap-8 md:gap-16">
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex gap-2 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <p className="text-base text-muted-foreground font-normal">Roadmaps</p>
            </div>
            <h2 className="text-5xl md:text-7xl font-semibold text-foreground">
              Featured Roadmaps.
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Service Rows */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 xl:px-16">
        <div className="flex flex-col gap-5 border-x">
          {serviceData.map((service, index) => (
            <motion.div
              key={service.number}
              className="flex lg:flex-row flex-col border-y first:border-t-0 last:border-b-0 group overflow-hidden p-0 lg:gap-0 gap-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              {/* Number + Title */}
              <div className="xl:max-w-md lg:max-w-xs w-full xl:py-10 xl:px-10 py-6 px-4 flex md:flex-row flex-col xl:gap-15 gap-6 group-hover:bg-card-foreground dark:group-hover:bg-white relative transition-colors duration-300">
                <span className="text-base font-normal text-foreground group-hover:text-white dark:group-hover:text-primary-foreground transition-colors duration-300">
                  ({service.number})
                </span>
                <h3 className="text-3xl font-medium text-foreground capitalize group-hover:text-white dark:group-hover:text-primary-foreground transition-colors duration-300">
                  {service.title}
                </h3>
              </div>

              {/* Image */}
              <div className="lg:p-5 lg:max-w-xs w-full border-x group-hover:border-white/10 group-hover:bg-card-foreground dark:group-hover:bg-white overflow-hidden transition-colors duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="group-hover:scale-125 transition-transform duration-300 ease-out h-full w-full object-cover"
                />
              </div>

              {/* Description + Arrow */}
              <div className="xl:max-w-md lg:max-w-xs w-full xl:py-10 xl:px-10 py-6 px-4 flex flex-col gap-6 justify-between group-hover:bg-card-foreground dark:group-hover:bg-white transition-colors duration-300">
                <p className="text-base text-primary/50 group-hover:text-white dark:group-hover:text-primary-foreground/50 transition-colors duration-300">
                  {service.description}
                </p>
                <div className="h-10 w-10 rounded-full bg-foreground dark:group-hover:bg-primary-foreground text-foreground flex justify-center items-center group-hover:bg-white transition-colors duration-300">
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-300 ease-out text-background group-hover:text-card-foreground"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
