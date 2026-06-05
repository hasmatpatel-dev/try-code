import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import ResponsiveShell from "@/components/mobile/responsive-shell";

export const metadata: Metadata = {
  title: 'TryCode - Full-Stack Blog CMS & LMS',
  description: 'A scalable CMS and Learning Management Foundation powering Blog Articles, AI Tutorials, Courses, and Student Dashboards.',
  metadataBase: new URL('https://hasmat-try-code.vercel.app'),
  alternates: {
    canonical: '/',
  },
}
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth dark" data-scroll-behavior="smooth">
      <body className= {`flex min-h-screen flex-col bg-[#030712] text-foreground antialiased ${inter.className}`}>
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
