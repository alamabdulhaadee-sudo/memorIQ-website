/**
 * SectionLabel
 *
 * Renders the consistent section-header label used across every major section:
 *   — 02 / WHO WE BUILD FOR
 *
 * The em dash, slash-separated index number, and small-caps label are the
 * visual thread that ties the whole site together (docs/02-design-system.md).
 *
 * Usage:
 *   <SectionLabel index="02" label="Who we build for" />
 *   <SectionLabel index="04" label="How it works" surface="light" />
 */

type SectionLabelSurface = "dark" | "light";

interface SectionLabelProps {
  /** Two-digit section index, e.g. "01", "02" */
  index: string;
  /** Label text — will be uppercased via CSS, write in sentence case in JSX */
  label: string;
  /** "dark" = on ink background (default), "light" = on bone background */
  surface?: SectionLabelSurface;
  className?: string;
}

const surfaceColor: Record<SectionLabelSurface, string> = {
  dark: "text-warm-gray",
  light: "text-warm-gray",
};

function SectionLabel({
  index,
  label,
  surface = "dark",
  className = "",
}: SectionLabelProps) {
  return (
    <p
      className={[
        "text-[11px] font-medium tracking-[0.18em] uppercase leading-none",
        surfaceColor[surface],
        className,
      ].join(" ")}
      aria-label={`Section ${index}: ${label}`}
    >
      {/* em dash — non-breaking space keeps dash + number together */}
      —&nbsp;{index}&nbsp;/&nbsp;{label.toUpperCase()}
    </p>
  );
}

export { SectionLabel };
export type { SectionLabelProps, SectionLabelSurface };
