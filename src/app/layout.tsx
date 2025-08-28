import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CalendarProvider } from "@/contexts/CalendarContext";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schedule Demo - Integrated Scheduling & Dynamic Routing",
  description: "A high-fidelity demo of automated crew scheduling for landscaping and field service industries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} light`} suppressHydrationWarning>
      <body className={`min-h-screen bg-background text-foreground font-sans antialiased`}>
        <ThemeProvider>
          <CalendarProvider>
            {children}
          </CalendarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}