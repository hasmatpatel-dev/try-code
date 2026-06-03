import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
    const footerLinks = [
        { label: "Home", href: "#" },
        { label: "Categories", href: "#" },
        { label: "Properties", href: "#" },
        { label: "Featured property", href: "#" },
        { label: "Testimonials", href: "#" },
        { label: "Blog", href: "#" },
        { label: "FAQs", href: "#" },
        { label: "404 page", href: "#" },
    ]
    return (
        <footer className="dark bg-background">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 md:py-24 py-8">
                <div className="flex flex-col gap-16">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-7 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
                            <h2 className="sm:text-5xl text-3xl font-medium mb-6 text-foreground">
                                Start learning computer science today.
                            </h2>
                            <Button className="py-3.5 px-6 rounded-full bg-teal-400 hover:bg-teal-400/80 h-auto">
                                Get started
                            </Button>
                        </div>
                        <div className="md:col-span-1" />
                        <div className="col-span-12 md:col-span-2 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
                            <div className="flex flex-col gap-4">
                                {footerLinks.slice(0, 4).map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="block text-base text-muted-foreground hover:text-primary"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-2 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 ease-in-out fill-mode-both">
                            <div className="flex flex-col gap-4">
                                {footerLinks.slice(4, 8).map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="block text-base text-muted-foreground hover:text-primary"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-12">
                        <Separator />
                        <p className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 ease-in-out fill-mode-both">
                            ©2026 Shadcn Space. All Rights Reserved
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}