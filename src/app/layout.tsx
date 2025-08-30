import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppModeProvider } from "@/contexts/AppModeContext";
import AppShell from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Work Order Management System",
  description: "Centralized work order management system for landscaping and field service operations",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} light`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Work Orders" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`min-h-screen bg-background text-foreground font-sans antialiased`}>
        <ThemeProvider>
          <AppModeProvider>
            <AppShell>
              {children}
            </AppShell>
          </AppModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}