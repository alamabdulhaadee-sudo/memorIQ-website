import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex-1 flex items-center justify-center py-32">
        <div className="text-center px-6 max-w-xl mx-auto">
          <p className="text-[var(--color-clay)] font-mono text-sm uppercase tracking-widest mb-6">
            — 404
          </p>
          <h1
            className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none uppercase text-[var(--color-bone)] mb-8"
            style={{ fontWeight: 800 }}
          >
            This page pulled a disappearing act.
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/"
              className="text-[var(--color-bone)] underline underline-offset-4 text-sm tracking-wide hover:text-[var(--color-clay)] transition-colors"
            >
              Back to the homepage →
            </Link>
            <span className="hidden sm:inline text-[var(--color-bone)]/30">
              /
            </span>
            <Link
              href="/work"
              className="text-[var(--color-bone)] underline underline-offset-4 text-sm tracking-wide hover:text-[var(--color-clay)] transition-colors"
            >
              Check the work →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
