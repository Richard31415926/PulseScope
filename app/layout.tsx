import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PulseScope",
    template: "%s | PulseScope",
  },
  description:
    "PulseScope is a premium frontend-only observability cockpit for traces, logs, incidents, and service health.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} dark`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
