"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const socialLinks = [
  {
    id: "twitter",
    href: "https://x.com/trycode",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "instagram",
    href: "https://instagram.com/trycode",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.162c3.204 0 3.584.012 4.849.07 1.17.054 1.805.249 2.228.413.56.218.96.478 1.38.898s.68.82.898 1.38c.164.423.36 1.058.413 2.228.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.053 1.17-.249 1.805-.413 2.228a3.7 3.7 0 0 1-.898 1.38c-.42.42-.82.68-1.38.898-.423.164-1.058.36-2.228.413-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.17-.053-1.805-.249-2.228-.413a3.7 3.7 0 0 1-1.38-.898c-.42-.42-.68-.82-.898-1.38-.164-.423-.36-1.058-.413-2.228C2.014 15.584 2 15.204 2 12s.014-3.584.072-4.848c.054-1.17.249-1.805.413-2.228.218-.56.478-.96.898-1.38s.82-.68 1.38-.898c.423-.164 1.058-.36 2.228-.413C8.416 2.174 8.796 2.162 12 2.162M12 0C8.741 0 8.332.014 7.052.072 5.775.131 4.902.333 4.14.63a5.9 5.9 0 0 0-2.126 1.384A5.9 5.9 0 0 0 .63 4.14C.333 4.903.131 5.775.072 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.059 1.277.261 2.15.558 2.912a5.9 5.9 0 0 0 1.384 2.126A5.9 5.9 0 0 0 4.14 23.37c.763.297 1.635.5 2.912.558C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.059 2.15-.261 2.912-.558a5.9 5.9 0 0 0 2.126-1.384 5.9 5.9 0 0 0 1.384-2.126c.297-.763.5-1.635.558-2.912C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.059-1.277-.261-2.15-.558-2.912a5.9 5.9 0 0 0-1.384-2.126A5.9 5.9 0 0 0 19.86.63C19.097.333 18.225.131 16.948.072 15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.846-10.406a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "github",
    href: "https://github.com/trycode",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.377 0 12c0 5.305 3.438 9.802 8.203 11.388.602.113.82-.258.82-.579 0-.285-.007-1.039-.012-2.04-3.34.724-4.043-1.612-4.043-1.612-.547-1.384-1.336-1.755-1.336-1.755-1.086-.742.087-.726.087-.726 1.203.082 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.495.996.105-.773.418-1.305.758-1.601-2.663-.301-5.465-1.332-5.465-5.93 0-1.314.465-2.383 1.234-3.223-.133-.301-.54-1.523.106-3.176 0 0 1.004-.32 3.3 1.23a11.6 11.6 0 0 1 3-.405c1.02.006 2.039.14 3 .405 2.282-1.55 3.285-1.23 3.285-1.23.645 1.652.238 2.874.121 3.176.762.84 1.227 1.91 1.227 3.223 0 4.608-2.805 5.625-5.472 5.918.416.359.807 1.098.807 2.219 0 1.605-.015 2.898-.015 3.289 0 .312.21.687.828.566A11.95 11.95 0 0 0 24 12c0-6.625-5.371-12-12-12" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    href: "https://linkedin.com/company/trycode",
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.633 13.633h-2.37V9.92c0-.885-.017-2.025-1.234-2.025-1.235 0-1.424.965-1.424 1.96v3.778h-2.37V5.998H8.51v1.043h.031a2.5 2.5 0 0 1 2.246-1.233c2.403 0 2.846 1.58 2.846 3.637zM3.56 4.954a1.376 1.376 0 1 1 0-2.751 1.376 1.376 0 0 1 0 2.751m1.185 8.679H2.372V5.998h2.373zM14.815.001H1.18A1.17 1.17 0 0 0 0 1.154v13.691A1.17 1.17 0 0 0 1.18 16h13.635A1.17 1.17 0 0 0 16 14.845V1.153A1.17 1.17 0 0 0 14.815 0" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >

      {/* Main body */}
      <div className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
          <div className="border-x border-border overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Left — Headline */}
              <motion.div
                className="flex flex-col gap-12 p-6 lg:p-12 border-b md:border-b-0 md:border-r border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h2 className="text-4xl lg:text-5xl xl:text-5xl font-medium text-foreground">
                  Ready to start your coding journey? Let&apos;s do it.
                </h2>
                <p className="text-base font-normal text-muted-foreground">
                  Let&apos;s build together
                </p>
              </motion.div>

              {/* Right — Contact + Socials */}
              <div className="flex flex-col justify-between">
                <motion.div
                  className="p-6 lg:p-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                >
                  <div className="flex flex-col gap-10">
                    {/* Avatar + name */}
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="relative flex items-center">
                        <img
                          src="https://api.dicebear.com/7.x/adventurer/svg?seed=trycode"
                          alt="TryCode team"
                          width={80}
                          height={80}
                          className="rounded-full relative z-10 bg-muted border border-border"
                        />
                      </div>
                      <div>
                        <p className="text-xl font-medium text-foreground">Hasmat Patel</p>
                        <p className="text-lg font-normal text-muted-foreground">UI Developer</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5 lg:gap-3">
                      <p className="text-base text-muted-foreground font-normal">Contact us</p>
                      <a
                        href="mailto:hello@trycode.dev"
                        className="text-2xl lg:text-3xl font-medium text-foreground hover:text-foreground/80 transition-colors"
                      >
                        hello@trycode.dev
                      </a>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href="/auth/sign-up"
                      className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden bg-primary text-primary-foreground hover:bg-primary/80 inline-flex items-center"
                    >
                      <span className="relative z-10 transition-all duration-500">Get Started</span>
                      <div className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </div>
                    </Link>
                  </div>
                </motion.div>

                {/* Social links */}
                <motion.div
                  className="grid grid-cols-4 min-h-20 border-t border-border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  {socialLinks.map((social, index) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.id}
                      className={`py-8 lg:py-12 flex items-center justify-center hover:bg-muted/50 transition-colors ${
                        index < socialLinks.length - 1 ? "border-r border-border" : ""
                      }`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Bottom bar */}
            <motion.div
              className="border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 px-6 lg:px-12 py-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <Link href="/" className="flex items-center gap-2.5">
                <span className="text-xl font-bold text-foreground tracking-tight">Try-Code</span>
              </Link>
              <p className="text-sm font-normal text-muted-foreground">
                © 2026 Try-Code. Modern Skills for Modern Developers.
              </p>
              <div className="flex items-center flex-wrap gap-4 text-xs font-normal text-muted-foreground">
                <Link href="#roadmaps" className="hover:text-foreground transition-colors">Roadmaps</Link>
                <Link href="#categories" className="hover:text-foreground transition-colors">Topics</Link>
                <Link href="#recipes" className="hover:text-foreground transition-colors">Recipes</Link>
                <Link href="#resources" className="hover:text-foreground transition-colors">Resources</Link>
                <Link href="#ai-mentor" className="hover:text-foreground transition-colors">AI Mentor</Link>
                <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16">
        <div className="border-x border-border px-5 md:px-8 py-8 overflow-hidden" />
      </div>
    </motion.footer>
  );
}