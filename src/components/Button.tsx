import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary";

type ButtonProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  variant?: Variant;
};

const BASE =
  "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium " +
  "transition duration-200 ease-linear-out " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus " +
  "motion-safe:hover:-translate-y-px motion-safe:active:translate-y-px";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:bg-primary-focus",
  secondary:
    "border border-hairline bg-surface-1 text-ink hover:bg-surface-2 active:bg-[#050507]",
};

export default function Button({
  variant = "primary",
  className = "",
  href,
  ...rest
}: ButtonProps) {
  const merged = `${BASE} ${VARIANTS[variant]}${className ? ` ${className}` : ""}`;
  return <Link href={href} className={merged} {...rest} />;
}
