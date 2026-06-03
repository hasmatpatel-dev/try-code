import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from "next/font/google";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: 'TryCode - Full-Stack Blog CMS & LMS',
  description: 'A scalable CMS and Learning Management Foundation powering Blog Articles, AI Tutorials, Courses, and Student Dashboards.',
}
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className= {`flex min-h-screen flex-col bg-background text-foreground antialiased ${inter.className}`}>
        <Providers>
          <main className="flex-1">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
