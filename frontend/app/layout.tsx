import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import AuthInitializer from "@/components/AuthInitializer";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import { Toaster } from "react-hot-toast";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DarkModeProvider>
          <ReduxProvider>
            <AuthInitializer>
              {children}
              <Toaster position="top-right" />
            </AuthInitializer>
          </ReduxProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
