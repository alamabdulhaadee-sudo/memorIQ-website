import Link from "next/link";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer
      className="bg-ink [border-top:0.5px_solid_var(--color-border-dark)] mt-auto"
      aria-label="Site footer"
    >
      {/* Main footer grid */}
      <div className="w-full mx-auto max-w-[1200px] px-md sm:px-lg lg:px-xl py-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] gap-[48px] lg:gap-[80px]">

          {/* Brand column */}
          <div className="flex flex-col gap-lg">
            <Link
              href="/"
              className="text-[15px] font-medium tracking-[-0.01em] text-bone hover:text-bone/80 transition-colors duration-150 w-fit"
            >
              MEMORIQ.
            </Link>
            <p className="text-[13px] text-warm-gray leading-[1.6] max-w-[240px]">
              A photo booth engineered for the moments worth remembering.
            </p>
          </div>

          {/* Navigation column */}
          <div className="flex flex-col gap-md">
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray">
              Navigation
            </p>
            <nav aria-label="Footer navigation" className="flex flex-col gap-[10px]">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[13px] text-warm-gray hover:text-bone transition-colors duration-150 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact column */}
          <div className="flex flex-col gap-md">
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray">
              Contact
            </p>
            <div className="flex flex-col gap-[10px]">
              <a
                href="mailto:hello@memoriq.co"
                className="text-[13px] text-warm-gray hover:text-bone transition-colors duration-150 w-fit"
              >
                hello@memoriq.co
              </a>
              <a
                href="tel:+1XXXXXXXXXX"
                className="text-[13px] text-warm-gray hover:text-bone transition-colors duration-150 w-fit"
              >
                (XXX) XXX-XXXX
              </a>
            </div>
          </div>

          {/* Follow column */}
          <div className="flex flex-col gap-md">
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray">
              Follow
            </p>
            <div className="flex flex-col gap-[10px]">
              <a
                href="https://instagram.com/memoriq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-bone hover:text-clay transition-colors duration-150 w-fit"
                aria-label="MEMORIQ on Instagram (opens in new tab)"
              >
                Instagram →
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom strip */}
      <div className="[border-top:0.5px_solid_var(--color-border-dark)]">
        <div className="w-full mx-auto max-w-[1200px] px-md sm:px-lg lg:px-xl py-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm">
          <p className="text-[12px] text-warm-gray tracking-[0.02em]">
            Proudly serving Toronto &amp; the GTA
          </p>
          <p className="text-[12px] text-warm-gray tracking-[0.02em]">
            © {new Date().getFullYear()} MEMORIQ Photo Booth
          </p>
        </div>
      </div>
    </footer>
  );
}
