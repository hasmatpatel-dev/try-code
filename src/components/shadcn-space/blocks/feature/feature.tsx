"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";

type FeatureCard = {
  icon: React.ReactNode;
  title: string;
  subtopics: string[];
  href: string;
};

const features: FeatureCard[] = [
  {
    icon: (
      <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44.0472 0.0419629C52.2082 -0.56809 59.322 5.54522 59.9464 13.7052C60.5709 21.8652 54.4701 28.9898 46.3113 29.6286C38.1323 30.2689 30.9862 24.1496 30.3603 15.9693C29.7342 7.78903 35.866 0.653614 44.0472 0.0419629Z" fill="var(--foreground)" />
        <path d="M13.7326 0.0428043C21.8997 -0.566716 29.0158 5.55702 29.6308 13.7237C30.2458 21.8905 24.1271 29.0109 15.9609 29.6315C7.78681 30.2526 0.658185 24.1266 0.0425872 15.952C-0.57301 7.7774 5.55771 0.652857 13.7326 0.0428043Z" fill="var(--foreground)" />
        <path d="M43.6928 30.3983C51.8461 29.5918 59.1097 35.5471 59.9174 43.7005C60.7245 51.8538 54.7699 59.118 46.6168 59.9266C38.4625 60.7344 31.1971 54.7789 30.3896 46.6245C29.5821 38.47 35.5384 31.205 43.6928 30.3983Z" fill="var(--foreground)" />
        <path d="M13.3852 30.3984C21.5583 29.595 28.829 35.5845 29.6055 43.7603C30.382 51.9361 24.3687 59.1875 16.1905 59.9368C8.05031 60.683 0.840301 54.7035 0.0674764 46.5657C-0.705424 38.4278 5.25004 31.1981 13.3852 30.3984Z" fill="var(--foreground)" />
      </svg>
    ),
    title: "AI & Productivity",
    subtopics: ["AI for Developers", "Prompt Engineering", "AI Image Generation", "AI Video Generation"],
    href: "#categories",
  },
  {
    icon: (
      <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.0794 0.0626096C44.6154 -0.99824 58.8795 11.5485 59.9375 28.0847C60.9954 44.621 48.4462 58.8832 31.9097 59.9381C15.3775 60.993 1.11985 48.4473 0.0622657 31.9152C-0.995405 15.3832 11.5475 1.12319 28.0794 0.0626096Z" fill="var(--foreground)" />
        <path d="M29.938 5.43555C30.2989 5.70233 30.5602 7.53155 30.7305 8.08825C31.295 9.93327 31.8036 11.8194 32.4381 13.6418C32.9825 15.2086 33.6536 16.7283 34.4448 18.1861C38.9063 26.3872 46.5536 27.6414 54.8401 30.0945C53.8653 30.2283 52.7 30.574 51.7309 30.8216C48.1695 31.7317 44.5933 32.8786 41.3706 34.6601C33.9206 38.7783 32.0471 47.0074 30.0278 54.7411C29.7404 54.245 29.1271 51.5842 28.9218 50.8406C27.7226 46.4984 26.3185 42.1085 23.3923 38.5921C19.8882 34.3811 14.429 32.5094 9.30873 31.1135C8.0174 30.7615 6.20919 30.2161 4.93066 30.0938C6.2741 29.8131 7.59979 29.3531 8.90976 28.9968C11.5513 28.2781 13.5889 27.6496 16.0963 26.5947C23.4013 23.5213 26.1866 18.3627 28.3824 11.0962C28.7664 9.82545 29.5103 6.48465 29.8996 5.52792L29.938 5.43555Z" fill="var(--background)" />
      </svg>
    ),
    title: "Frontend Development",
    subtopics: ["React", "Next.js"],
    href: "#categories",
  },
  {
    icon: (
      <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 53 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M47.1487 0.0670867C48.4014 -0.0721207 50.9889 0.0360448 52.2517 0.115703L52.2452 59.8668C44.0025 60.5593 37.4147 58.5575 30.7882 53.7155C30.3678 53.3668 29.9518 53.0131 29.5399 52.6544C23.611 47.5495 19.9392 40.3087 19.3243 32.509C18.7418 24.2589 21.1374 16.5248 26.5911 10.2612C31.8137 4.26264 39.2125 0.593654 47.1487 0.0670867Z" fill="var(--foreground)" />
        <path d="M13.7278 2.74805L13.7851 2.76249C13.9633 3.05047 13.8932 5.37024 13.8927 5.9175L13.8902 15.0509L13.8949 57.4238C11.0304 55.1573 9.23544 53.4662 6.9353 50.5903C6.80712 50.4316 6.68324 50.2693 6.56385 50.1038C1.12383 42.6355 -1.06689 33.2857 0.489289 24.1782C1.84895 15.8684 6.88375 7.66687 13.7278 2.74805Z" fill="var(--foreground)" />
      </svg>
    ),
    title: "WordPress Ecosystem",
    subtopics: ["WordPress", "Elementor", "ACF Pro", "CPT UI"],
    href: "#categories",
  },
  {
    icon: (
      <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44.0472 0.0419629C52.2082 -0.56809 59.322 5.54522 59.9464 13.7052C60.5709 21.8652 54.4701 28.9898 46.3113 29.6286C38.1323 30.2689 30.9862 24.1496 30.3603 15.9693C29.7342 7.78903 35.866 0.653614 44.0472 0.0419629Z" fill="var(--foreground)" />
        <path d="M13.7326 0.0428043C21.8997 -0.566716 29.0158 5.55702 29.6308 13.7237C30.2458 21.8905 24.1271 29.0109 15.9609 29.6315C7.78681 30.2526 0.658185 24.1266 0.0425872 15.952C-0.57301 7.7774 5.55771 0.652857 13.7326 0.0428043Z" fill="var(--foreground)" />
      </svg>
    ),
    title: "Design & No-Code",
    subtopics: ["UI/UX", "Webflow", "Framer"],
    href: "#categories",
  },
  {
    icon: (
      <svg className="w-12 h-12 md:w-14 md:h-14" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.0794 0.0626096C44.6154 -0.99824 58.8795 11.5485 59.9375 28.0847C60.9954 44.621 48.4462 58.8832 31.9097 59.9381C15.3775 60.993 1.11985 48.4473 0.0622657 31.9152C-0.995405 15.3832 11.5475 1.12319 28.0794 0.0626096Z" fill="var(--foreground)" />
      </svg>
    ),
    title: "Engineering Excellence",
    subtopics: ["Testing", "Performance", "Architecture"],
    href: "#categories",
  },
];

const Feature = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setColumns(3);
      } else if (window.innerWidth >= 768) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const extendedFeatures = [...features, ...features];

  return (
    <section id="categories" className="overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
        <div className="w-full border-x border-border">
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
                  <p className="text-base text-muted-foreground font-normal">Topics</p>
                </div>
                <h2 className="text-5xl md:text-7xl font-semibold text-foreground">
                  Learning Categories.
                </h2>
              </motion.div>
          </div>

          <div className="overflow-hidden w-full border-t border-border relative">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${activeIndex * (100 / columns)}%)`,
              }}
            >
              {extendedFeatures.map((feature, index) => (
                <div
                  key={`${feature.title}-${index}`}
                  className="w-full md:w-1/2 lg:w-1/3 shrink-0 relative group p-6 sm:p-8 flex flex-col justify-between gap-6 min-h-[22.5rem] lg:min-h-[26rem] border-b border-r border-border transition-all duration-500 overflow-hidden cursor-pointer"
                >
                  {/* Accent top-line indicator */}
                  <div className="absolute top-0 left-0 h-0.5 bg-primary z-20 w-0 group-hover:w-full transition-all duration-500" />

                  {/* Icon */}
                  <div className="z-10 opacity-70 group-hover:opacity-100 transition-opacity">{feature.icon}</div>

                  {/* Text + CTA */}
                  <div className="flex flex-col gap-0 group-hover:gap-6 z-10 transition-all duration-500 group-hover:-translate-y-4">
                    <div className="flex flex-col gap-3 sm:gap-5">
                      <h3 className="text-2xl font-medium text-foreground transition-all duration-300">
                        {feature.title}
                      </h3>
                      <ul className="space-y-1.5">
                        {feature.subtopics.map((sub, i) => (
                          <li key={i} className="text-base font-normal text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Slide-in CTA */}
                    <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-20 opacity-0 group-hover:opacity-100 w-fit">
                      <Link
                        href={feature.href}
                        className="inline-flex items-center justify-center w-fit h-auto px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/80 rounded-lg cursor-pointer font-medium text-sm transition-colors mt-4"
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
