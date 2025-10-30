import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import AuthInitializer from "@/components/AuthInitializer";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/contexts/DarkModeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Link - Website Directory",
  description: "A modern website directory with smart categorization and AI-powered descriptions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <ReduxProvider>
            <AuthInitializer>
              {children}
              <Toaster position="top-right" />
            </AuthInitializer>
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}