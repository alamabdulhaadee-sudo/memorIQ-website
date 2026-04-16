/**
 * Container
 *
 * Centered max-width wrapper. All page sections use this to constrain content
 * width and apply consistent horizontal padding.
 *
 * Sizes:
 *   "default" — 1200px, for most sections
 *   "narrow"  — 720px, for text-heavy sections (about, legal, contact)
 *   "wide"    — 1400px, for gallery and full-bleed sections
 *   "full"    — no max-width cap, padding only
 *
 * Usage:
 *   <Container>...</Container>
 *   <Container size="narrow" className="py-4xl">...</Container>
 */

type ContainerSize = "default" | "narrow" | "wide" | "full";

interface ContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  /** Extra classes — use for vertical padding on sections */
  className?: string;
  as?: React.ElementType;
}

const maxWidths: Record<ContainerSize, string> = {
  default: "max-w-[1200px]",
  narrow: "max-w-[720px]",
  wide: "max-w-[1400px]",
  full: "max-w-none",
};

function Container({
  children,
  size = "default",
  className = "",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={[
        "w-full mx-auto px-md",         // 16px on mobile
        "sm:px-lg",                      // 24px on sm
        "lg:px-xl",                      // 32px on lg
        maxWidths[size],
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

export { Container };
export type { ContainerProps, ContainerSize };
