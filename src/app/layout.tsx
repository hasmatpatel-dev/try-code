import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { inter, instrumentSerif } from "@/lib/fonts";
import Providers from "@/components/providers";
import ResponsiveShell from "@/components/mobile/responsive-shell";

export const metadata: Metadata = {
  title: 'TryCode - Full-Stack Blog CMS & LMS',
  description: 'A scalable CMS and Learning Management Foundation powering Blog Articles, AI Tutorials, Courses, and Student Dashboards.',
  metadataBase: new URL('https://hasmat-try-code.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} scroll-smooth dark`} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col bg-[#030712] text-foreground antialiased font-sans">
        <Providers>
          <ResponsiveShell>
            <main className="flex-1">
              {children}
            </main>
          </ResponsiveShell>
        </Providers>
      </body>
    </html>
  )
}
