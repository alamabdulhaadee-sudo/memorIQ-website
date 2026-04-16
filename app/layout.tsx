import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MEMORIQ Photo Booth — Greater Toronto Area",
  description:
    "Premium photo booth rental for weddings, corporate events, and celebrations across the Greater Toronto Area. Book online with a deposit.",
  openGraph: {
    title: "MEMORIQ Photo Booth",
    description:
      "Premium photo booth rental across the Greater Toronto Area.",
    siteName: "MEMORIQ",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Nav />
        {/*
          pt-[60px] on mobile / pt-[68px] on sm+ matches the nav height
          so page content is never hidden behind the sticky header.
          Hero sections that want to bleed behind the nav should apply
          negative margin-top instead of relying on this padding.
        */}
        <div className="flex flex-col flex-1 pt-[60px] sm:pt-[68px]">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
