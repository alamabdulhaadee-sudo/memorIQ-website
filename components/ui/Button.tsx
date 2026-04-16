import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary";

/**
 * surface controls which border/text tokens the secondary ghost uses.
 * "dark"  = on ink/dark background (default)
 * "light" = on bone/light background
 */
type ButtonSurface = "dark" | "light";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  surface?: ButtonSurface;
  /** Renders an <a> tag instead of <button>. Provide href to activate. */
  href?: string;
  asChild?: never;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-full text-[13px] font-medium leading-none tracking-[0.01em] cursor-pointer select-none transition-all duration-150 ease-[ease] whitespace-nowrap disabled:opacity-40 disabled:pointer-events-none";

const variantStyles: Record<ButtonVariant, Record<ButtonSurface, string>> = {
  primary: {
    // Surface doesn't change primary — clay is always clay
    dark: "bg-clay text-ink px-[26px] py-[14px] hover:brightness-90 active:brightness-75",
    light: "bg-clay text-ink px-[26px] py-[14px] hover:brightness-90 active:brightness-75",
  },
  secondary: {
    dark: [
      "bg-transparent text-bone px-[22px] py-[14px]",
      // 0.5px hairline border — Tailwind doesn't have a 0.5px border utility so we use outline
      "[border:0.5px_solid_var(--color-border-dark-strong)]",
      "hover:[border-color:var(--color-bone)] hover:text-bone",
    ].join(" "),
    light: [
      "bg-transparent text-ink-soft px-[22px] py-[14px]",
      "[border:0.5px_solid_var(--color-border-light)]",
      "hover:[border-color:var(--color-ink-soft)] hover:text-ink-soft",
    ].join(" "),
  },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      surface = "dark",
      href,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      baseStyles,
      variantStyles[variant][surface],
      className,
    ].join(" ");

    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSurface };
