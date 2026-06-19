import React from 'react';
import { MobileShellProvider } from './mobile-shell-context';
import MobileAppShell from './mobile-app-shell';

export default function ResponsiveShell({ children }: { children: React.ReactNode }) {
  return (
    <MobileShellProvider>
      <MobileAppShell>{children}</MobileAppShell>
    </MobileShellProvider>
  );
}
