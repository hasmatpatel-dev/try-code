"use client";

import { useState, useEffect, useCallback } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, LayoutDashboard, User as UserIcon, ChevronDown, ArrowUpRight, Dribbble, Instagram, Twitter, Linkedin } from 'lucide-react';
import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from 'next/link';

import { useAppDispatch, useAppSelector } from "@/lib/store";
import { clearSession } from "@/features/authSlice";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export type NavigationSection = {
  title: string;
  href: string;
  isActive?: boolean;
};

type HeaderProps = {
  navigationData?: NavigationSection[];
  className?: string;
};

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

const UserProfileMenu = ({ user, handleLogout, router }: { user: any; handleLogout: () => void; router: any }) => {
  const avatarSrc = user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2.5 rounded-full border border-border/85 bg-[#090D1A]/95 p-1 ps-1 pr-4 hover:bg-[#161C2C]/50 hover:border-purple-500/30 transition-all select-none cursor-pointer focus:outline-none">
        <Avatar className="h-8 w-8 rounded-full ring-2 ring-purple-500/20">
          <AvatarImage src={avatarSrc} alt={user.name || 'User'} className="object-cover" />
          <AvatarFallback className="bg-purple-600/10 text-purple-400 font-bold text-xs uppercase">
            {user.name ? user.name.substring(0, 2) : 'US'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-white leading-tight max-w-[100px] truncate">
            {user.name}
          </span>
          <span className="text-[9px] font-bold text-purple-400 leading-none capitalize">
            {user.role}
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-1 shrink-0 animate-pulse" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2 border border-[#161C2C] bg-[#090D1A]/95 backdrop-blur-xl shadow-2xl p-1.5 rounded-2xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-2 flex flex-col">
            <span className="text-xs font-bold text-white truncate">{user.name}</span>
            <span className="text-[10px] text-gray-400 truncate">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[#161C2C] my-1" />
        <DropdownMenuItem
          onClick={() => router.push('/dashboard')}
          className="flex items-center rounded-xl px-2.5 py-2.5 text-xs font-semibold text-gray-300 hover:bg-[#161C2C]/50 hover:text-white cursor-pointer transition"
        >
          <LayoutDashboard className="h-4 w-4 mr-2.5 text-gray-400" />
          <span>CMS Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/profile')}
          className="flex items-center rounded-xl px-2.5 py-2.5 text-xs font-semibold text-gray-300 hover:bg-[#161C2C]/50 hover:text-white cursor-pointer transition"
        >
          <UserIcon className="h-4 w-4 mr-2.5 text-gray-400" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#161C2C] my-1" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center rounded-xl px-2.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer transition"
        >
          <LogOut className="h-4 w-4 mr-2.5 text-red-400" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = ({ navigationData, className }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(clearSession());
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const defaultNavigationData: NavigationSection[] = [
    {
      title: "Home",
      href: "/",
      isActive: pathname === "/" && activeSection === "home",
    },
    {
      title: "Roadmaps",
      href: "/#roadmaps",
      isActive: pathname === "/" && activeSection === "roadmaps",
    },
    {
      title: "Topics",
      href: "/#categories",
      isActive: pathname === "/" && activeSection === "categories",
    },
    {
      title: "Recipes",
      href: "/#recipes",
      isActive: pathname === "/" && activeSection === "recipes",
    },
    {
      title: "Resources",
      href: "/#resources",
      isActive: pathname === "/" && activeSection === "resources",
    },
    {
      title: "Blog",
      href: "/blog",
      isActive: pathname === "/blog" || pathname.startsWith("/blog/"),
    },
  ];

  const mobileNavigationData: NavigationSection[] = [
    {
      title: "Home",
      href: "/",
      isActive: pathname === "/" && activeSection === "home",
    },
    {
      title: "Roadmap",
      href: "/#roadmaps",
      isActive: pathname === "/" && activeSection === "roadmaps",
    },
    {
      title: "Topic",
      href: "/#categories",
      isActive: pathname === "/" && activeSection === "categories",
    },
    {
      title: "Recipes",
      href: "/#recipes",
      isActive: pathname === "/" && activeSection === "recipes",
    },
    {
      title: "Resources",
      href: "/#resources",
      isActive: pathname === "/" && activeSection === "resources",
    },
    {
      title: "Blog",
      href: "/blog",
      isActive: pathname === "/blog" || pathname.startsWith("/blog/"),
    },
  ];

  const currentNavigationData = navigationData || defaultNavigationData;

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);

    // Active Section Logic
    const sectionIds = ["home", "roadmaps", "categories", "recipes", "resources"];
    const headerHeight = 120; // height of sticky header plus a buffer

    // Check if user has scrolled to the bottom of the page
    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
    if (isAtBottom) {
      setActiveSection("resources");
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
    <header
      className={cn(
        "inset-x-0 z-50 sticky top-0 w-full bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300",
        sticky ? "shadow-md shadow-primary/5" : "",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16 w-full">
        <div className="border-x border-border px-4 md:px-8 h-20 flex items-center justify-between gap-3.5 lg:gap-6 w-full">
          {/* Logo */}
          <div>
            <Link href="/" aria-label="TryCode Homepage">
              <Logo className="gap-3" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div>
            <NavigationMenu className="hidden lg:flex bg-muted p-0.5 rounded-full">
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
            {user ? (
              <div className="hidden lg:flex">
                <UserProfileMenu user={user} handleLogout={handleLogout} router={router} />
              </div>
            ) : (
              <CollaborateButton className="hidden lg:flex" />
            )}

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
                    <Link href="/" aria-label="TryCode Homepage">
                      <Logo className="gap-2" />
                    </Link>
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
                          {mobileNavigationData.map((item) => (
                            <NavigationMenuItem key={item.title}>
                              <NavigationMenuLink
                                href={item.href}
                                onClick={() => setIsOpen(false)}
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

                      <div className="w-fit" onClick={() => setIsOpen(false)}>
                        {user ? (
                          <UserProfileMenu user={user} handleLogout={handleLogout} router={router} />
                        ) : (
                          <CollaborateButton />
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-4">
                      <div className="flex gap-3">
                        {[
                          { Icon: Dribbble, label: "Dribbble" },
                          { Icon: Instagram, label: "Instagram" },
                          { Icon: Twitter, label: "Twitter" },
                          { Icon: Linkedin, label: "LinkedIn" },
                        ].map(({ Icon, label }) => (
                          <a
                            key={label}
                            href="#"
                            aria-label={label}
                            className="flex items-center justify-center rounded-full outline outline-border hover:bg-muted transition p-3 shadow-xs"
                          >
                            <Icon width={16} height={16} />
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
      </div>
    </header>
  );
};

export default Header;