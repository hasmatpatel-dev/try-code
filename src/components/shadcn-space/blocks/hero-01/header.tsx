"use client";

import { useState, useEffect, useCallback } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Menu, X } from 'lucide-react';
import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export type NavigationSection = {
  title: string;
  href: string;
  isActive?: boolean;
};

type HeaderProps = {
  navigationData?: NavigationSection[];
  className?: string;
};

import Link from 'next/link';

const CollaborateButton = ({ className }: { className?: string }) => (
  <Link
    href="/dashboard"
    className={cn(
      "relative inline-flex items-center justify-center text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-4 w-fit overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs",
      className
    )}
  >
    <span className="relative z-10 transition-all duration-500">
      CMS Dashboard
    </span>
    <span className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
      <ArrowUpRight size={16} />
    </span>
  </Link>
);

const Header = ({ navigationData, className }: HeaderProps) => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  const defaultNavigationData: NavigationSection[] = [
    {
      title: "Home",
      href: "#home",
      isActive: activeSection === "home",
    },
    {
      title: "About us",
      href: "#about-us",
      isActive: activeSection === "about-us",
    },
    {
      title: "Services",
      href: "#services",
      isActive: activeSection === "services",
    },
    {
      title: "Team",
      href: "#team",
      isActive: activeSection === "team",
    },
    {
      title: "Pricing",
      href: "#pricing",
      isActive: activeSection === "pricing",
    },
    {
      title: "Awards",
      href: "#awards",
      isActive: activeSection === "awards",
    },
  ];

  const currentNavigationData = navigationData || defaultNavigationData;

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);

    // Active Section Logic
    const sectionIds = ["home", "about-us", "awards", "services", "team", "pricing"];
    const headerHeight = 120; // height of sticky header plus a buffer

    // Check if user has scrolled to the bottom of the page
    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
    if (isAtBottom) {
      setActiveSection("pricing");
      return;
    }

    let currentActive = "home";
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const id = sectionIds[i];
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= headerHeight) {
          currentActive = id;
          break;
        }
      }
    }
    setActiveSection(currentActive);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initialize active section on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={cn(
        "inset-x-0 z-50 px-4 flex items-center justify-center sticky top-0 h-20",
        className,
      )}
    >
      <div
        className={cn(
          "w-full max-w-6xl flex items-center h-fit justify-between gap-3.5 lg:gap-6 transition-all duration-500",
          sticky
            ? "p-2.5 bg-background/60 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full"
            : "bg-transparent border-transparent",
        )}
      >
        {/* Logo */}
        <div>
          <a href="#" aria-label="TryCode Homepage">
            <Logo className="gap-3" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div>
          <NavigationMenu className="max-lg:hidden bg-muted p-0.5 rounded-full">
            <NavigationMenuList className="flex gap-0">
              {currentNavigationData.map((navItem) => (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink
                    href={navItem.href}
                    className={cn("px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal", navItem.isActive ? "bg-background text-foreground" : "")}
                  >
                    {navItem.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop CTA */}
        <div className="flex gap-4">
          <CollaborateButton className="hidden lg:flex" />

          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger id="mobile-menu-trigger" aria-label="Open menu">
                <span className="rounded-full border border-border p-2 block">
                  <Menu
                    width={20}
                    height={20}
                  />
                  <span className="sr-only">Menu</span>
                </span>
              </SheetTrigger>

              <SheetContent
                showCloseButton={false}
                side="right"
                className="w-full sm:w-96 p-0 border-l-0"
              >
                <div className="flex items-center justify-between p-6">
                  <a href="#" aria-label="TryCode Homepage">
                    <Logo className="gap-2" />
                  </a>
                  <SheetClose id="mobile-menu-close" aria-label="Close menu">
                    <span className="rounded-full border border-border p-2.5 block">
                      <X width={16} height={16} />
                    </span>
                  </SheetClose>
                </div>

                <div className="flex flex-col gap-12 px-6 pb-6 overflow-y-auto">
                  <div className="flex flex-col gap-8">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <NavigationMenu
                      orientation="vertical"
                      className="items-start flex-none"
                    >
                      <NavigationMenuList className="flex flex-col items-start gap-3">
                        {currentNavigationData.map((item) => (
                          <NavigationMenuItem key={item.title}>
                            <NavigationMenuLink
                              href={item.href}
                              className={cn(
                                "group/nav flex items-center text-2xl font-semibold tracking-tight transition-all p-0 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent",
                                item.isActive
                                  ? "text-primary"
                                  : "text-muted-foreground hover:text-foreground hover:translate-x-2",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-0.5 bg-primary transition-all duration-300 overflow-hidden",
                                  item.isActive
                                    ? "w-4 mr-2 opacity-100"
                                    : "w-0 opacity-0 group-hover/nav:w-4 group-hover/nav:mr-2 group-hover/nav:opacity-100",
                                )}
                              />
                              {item.title}
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        ))}
                      </NavigationMenuList>
                    </NavigationMenu>

                    <div className="w-fit">
                      <CollaborateButton />
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-4">
                    <div className="flex gap-3">
                      {[
                        { icon: "lucide:dribbble", label: "Dribbble" },
                        { icon: "lucide:instagram", label: "Instagram" },
                        { icon: "lucide:twitter", label: "Twitter" },
                        { icon: "lucide:linkedin", label: "LinkedIn" },
                      ].map(({ icon, label }) => (
                        <a
                          key={icon}
                          href="#"
                          aria-label={label}
                          className="flex items-center justify-center rounded-full outline outline-border hover:bg-muted transition p-3 shadow-xs"
                        >
                          <Icon icon={icon} width={16} height={16} />
                        </a>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      © 2026 Shadcn Space
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;