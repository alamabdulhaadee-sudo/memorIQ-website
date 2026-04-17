import { Hero } from "@/components/home/Hero";
import { ExperiencePreview } from "@/components/home/ExperiencePreview";
import { ServicesBands } from "@/components/home/ServicesBands";
import { HowItWorks } from "@/components/home/HowItWorks";
import { GalleryGrid } from "@/components/home/GalleryGrid";
import { Pricing } from "@/components/home/Pricing";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { ClosingCTA } from "@/components/home/ClosingCTA";

export default function HomePage() {
  return (
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
  );
}
