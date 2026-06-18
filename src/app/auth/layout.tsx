'use client';

import React from 'react';
import Header from '@/components/shadcn-space/blocks/hero/header';
import Footer02 from '@/components/shadcn-space/blocks/footer/footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030712] text-foreground flex flex-col justify-between">
      <Header className="fixed top-0 z-50 w-full flex" />

      {/* Background radial glow */}
      <div className="relative overflow-hidden pt-20 flex-1 flex flex-col justify-center">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-950/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16 w-full flex-1 flex flex-col">
          <div className="border-x border-border px-5 md:px-8 py-12 lg:py-16 flex flex-col items-center justify-center flex-1 w-full">
            {children}
          </div>
        </div>
      </div>
      <Footer02 />
    </div>
  );
}
