import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  icon?: ReactNode;
}

const variants = {
  primary:
    "bg-primary text-white shadow-lg shadow-primary/10 hover:shadow-primary/20",
  secondary:
    "bg-secondary-container text-on-secondary-container hover:brightness-95",
  ghost: "border border-glass-border text-dark-slate hover:bg-white/40",
  danger: "border border-red-500/20 text-red-500 hover:bg-red-500/10",
};

const sizes = {
  sm: "text-xs px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2 rounded-xl",
  lg: "text-base px-6 py-3 rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-cta inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-95 disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
