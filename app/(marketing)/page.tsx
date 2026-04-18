import type { Metadata } from "next";
import Script from "next/script";
import { Hero } from "@/components/home/Hero";
import { ExperiencePreview } from "@/components/home/ExperiencePreview";
import { ServicesBands } from "@/components/home/ServicesBands";
import { HowItWorks } from "@/components/home/HowItWorks";
import { GalleryGrid } from "@/components/home/GalleryGrid";
import { Pricing } from "@/components/home/Pricing";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { ClosingCTA } from "@/components/home/ClosingCTA";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://memoriq.ca";

export const metadata: Metadata = {
  title: "MEMORIQ Photo Booth — Greater Toronto Area",
  description:
    "Premium photo booth rentals for weddings, corporate events, and celebrations across the Greater Toronto Area. DSLR quality, instant prints, custom templates.",
  openGraph: {
    title: "MEMORIQ Photo Booth — Greater Toronto Area",
    description:
      "Premium photo booth rentals for weddings, corporate events, and celebrations across the Greater Toronto Area. DSLR quality, instant prints, custom templates.",
    type: "website",
    url: `${BASE_URL}/`,
    siteName: "MEMORIQ",
    locale: "en_CA",
    // TODO: Replace with a unique OG image (1200×630) before launch
    images: [{ url: `${BASE_URL}/og-default.jpg`, width: 1200, height: 630 }],
  },
};

// Schema.org LocalBusiness structured data
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "MEMORIQ Photo Booth",
  description:
    "Premium photo booth rental for weddings, corporate events, and celebrations across the Greater Toronto Area.",
  url: BASE_URL,
  telephone: "+1-647-000-0000", // TODO: Replace with real phone number before launch
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.6532,
    longitude: -79.3832,
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Greater Toronto Area",
  },
  priceRange: "$$",
  image: `${BASE_URL}/og-default.jpg`, // TODO: Replace with real event photo before launch
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "47", // TODO: Update with real review count before launch
  },
};

export default function HomePage() {
  return (
    <>
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <main className="flex-1">
        <Hero />
        <ExperiencePreview />
        <ServicesBands />
        <HowItWorks />
        <GalleryGrid />
        <Pricing />
        <Testimonials />
        <FAQ />
        <ClosingCTA />
      </main>
    </>
  );
}
