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
    title: "Full Stack Development",
    description:
      "Master end-to-end web development with hands-on projects covering React, Next.js, Node.js, and cloud deployment pipelines.",
    image: "https://images.shadcnspace.com/assets/services/app-design.webp",
  },
  {
    number: "02",
    title: "React & Next.js",
    description:
      "Deep dive into modern React architecture, Server Components, App Router, and performance optimisation techniques for production apps.",
    image: "https://images.shadcnspace.com/assets/services/web-design.webp",
  },
  {
    number: "03",
    title: "Database & Backend",
    description:
      "Learn PostgreSQL, Supabase, Prisma ORM, and RESTful API design with real-world schema design and Row-Level Security patterns.",
    image: "https://images.shadcnspace.com/assets/services/project-design.webp",
  },
  {
    number: "04",
    title: "AI & Machine Learning",
    description:
      "Build intelligent applications using LLMs, vector databases, and AI coding agents — from prompt engineering to production deployment.",
    image: "https://images.shadcnspace.com/assets/services/brand-design.webp",
  },
];

const Services = () => {
  return (
    <section className="border-y">
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
              <p className="text-base text-muted-foreground font-normal">Courses</p>
            </div>
            <h2 className="text-5xl md:text-7xl font-semibold text-foreground">
              What we teach.
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
                <div className="h-10 w-10 rounded-full bg-foreground dark:group-hover:bg-primary-foreground text-white flex justify-center items-center group-hover:bg-white transition-colors duration-300">
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 ease-out group-hover:text-card-foreground"
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
