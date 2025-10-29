// app/contexts/DarkModeContext.tsx (or wherever you store Providers)
'use client';
import { ThemeProvider } from 'next-themes';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class" // adds or removes 'dark' class on <html>
      defaultTheme="system" // use OS preference initially
      enableSystem={true}
      disableTransitionOnChange // avoid flicker
    >
      {children}
    </ThemeProvider>
  );
}
