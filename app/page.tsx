import { Hero } from "@/components/home/Hero";
import { ExperiencePreview } from "@/components/home/ExperiencePreview";

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <ExperiencePreview />
      {/* Phase 2 sections will follow */}
    </main>
  );
}
