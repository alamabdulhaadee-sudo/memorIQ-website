"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Detect scroll to apply backdrop blur + hairline border
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-150 ease-[ease]",
          scrolled
            ? "bg-ink/90 backdrop-blur-md [border-bottom:0.5px_solid_var(--color-border-dark-strong)]"
            : "bg-transparent [border-bottom:0.5px_solid_transparent]",
        ].join(" ")}
      >
        <div className="w-full mx-auto max-w-[1200px] px-md sm:px-lg lg:px-xl">
          <div className="flex items-center justify-between h-[60px] sm:h-[68px]">

            {/* Logo */}
            <Link
              href="/"
              className="text-[15px] font-medium tracking-[-0.01em] text-bone hover:text-bone/80 transition-colors duration-150 shrink-0"
            >
              MEMORIQ.
            </Link>

            {/* Desktop nav links — centered */}
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-[32px] absolute left-1/2 -translate-x-1/2"
            >
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "text-[13px] font-medium tracking-[0.01em] transition-colors duration-150",
                    pathname === href
                      ? "text-bone"
                      : "text-warm-gray hover:text-bone",
                  ].join(" ")}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex shrink-0">
              <Button href="/book" variant="primary">
                Check availability →
              </Button>
            </div>

            {/* Mobile right side: small CTA + hamburger */}
            <div className="flex md:hidden items-center gap-sm">
              <Button
                href="/book"
                variant="primary"
                className="text-[12px] px-[16px] py-[10px]"
              >
                Check availability
              </Button>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="flex flex-col justify-center items-center w-[36px] h-[36px] gap-[5px] shrink-0"
              >
                <span
                  className={[
                    "block h-px w-[20px] bg-bone transition-all duration-200 origin-center",
                    menuOpen ? "translate-y-[6px] rotate-45" : "",
                  ].join(" ")}
                />
                <span
                  className={[
                    "block h-px w-[20px] bg-bone transition-all duration-200",
                    menuOpen ? "opacity-0 scale-x-0" : "",
                  ].join(" ")}
                />
                <span
                  className={[
                    "block h-px w-[20px] bg-bone transition-all duration-200 origin-center",
                    menuOpen ? "-translate-y-[6px] -rotate-45" : "",
                  ].join(" ")}
                />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      <div
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={[
          "fixed inset-0 z-40 bg-ink flex flex-col px-md pt-[80px] pb-[48px]",
          "transition-opacity duration-200 ease-[ease]",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-[4px] mt-[32px]"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={[
                "text-[clamp(32px,8vw,48px)] font-medium tracking-[-0.02em] leading-[1.1] py-[12px]",
                "[border-bottom:0.5px_solid_var(--color-border-dark)]",
                "transition-colors duration-150",
                pathname === href ? "text-bone" : "text-warm-gray hover:text-bone",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Button href="/book" variant="primary" className="w-full justify-center text-[15px] py-[16px]">
            Check availability →
          </Button>
        </div>
      </div>
    </>
  );
}
