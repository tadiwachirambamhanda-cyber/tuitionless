import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "primaryOnHero" | "secondary" | "ghost";
const base = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background,box-shadow] duration-(--duration-base) text-lg";
const styles: Record<Variant, string> = {
  primary: "min-h-[52px] px-6 bg-(image:--gradient-action) hover:bg-(image:--gradient-action-hover) text-white shadow-(--shadow-action)",
  primaryOnHero: "min-h-[52px] px-6 bg-ink text-white hover:bg-[#3d2620]",
  secondary: "min-h-[52px] px-6 bg-surface border-[1.5px] border-border-strong text-ink hover:bg-surface-muted",
  ghost: "min-h-11 px-3 text-base text-brand-text hover:bg-surface-muted/70",
};

type Common = { variant?: Variant; className?: string; children: ReactNode };
type AsLink = Common & { href: string; target?: string; rel?: string };
type AsButton = Common & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className = "", children } = props;
  const cls = `${base} ${styles[variant]} ${className}`;
  if (props.href !== undefined) {
    const { href, target, rel } = props;
    if (target === "_blank") {
      return <a href={href} target={target} rel={rel ?? "noopener noreferrer"} className={cls}>{children}</a>;
    }
    return <Link href={href} className={cls}>{children}</Link>;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, className: _c, children: _ch, href: _h, ...rest } = props;
  return <button type="button" {...rest} className={cls}>{children}</button>;
}
