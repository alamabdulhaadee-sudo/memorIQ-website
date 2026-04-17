import { Hero } from "@/components/home/Hero";
import { ExperiencePreview } from "@/components/home/ExperiencePreview";
import { ServicesBands } from "@/components/home/ServicesBands";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <ExperiencePreview />
      <ServicesBands />
      <HowItWorks />
      {/* Phase 2 sections will follow */}
    </main>
  );
}
