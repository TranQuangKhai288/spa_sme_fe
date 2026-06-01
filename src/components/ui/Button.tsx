import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "icon" | "pill";
  size?: "sm" | "md" | "lg" | "none";
  children?: ReactNode; // Make children optional since icon button might only have an icon prop
  icon?: ReactNode;
}

const variants = {
  primary:
    "bg-primary text-white shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:brightness-110",
  secondary:
    "bg-secondary-container text-on-secondary-container hover:brightness-95",
  ghost: "border border-glass-border text-dark-slate hover:bg-white/40",
  danger: "border border-red-500/20 text-red-500 hover:bg-red-500/10",
  icon: "rounded-full hover:bg-white/50 text-on-surface-variant/80 hover:text-on-surface flex items-center justify-center cursor-pointer",
  pill: "text-[11px] font-bold bg-primary/5 hover:bg-primary text-primary hover:text-white border border-primary/15 hover:border-primary rounded-full transition-all duration-200 shadow-sm cursor-pointer",
};

const sizes = {
  sm: "text-xs px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2 rounded-xl",
  lg: "text-base px-6 py-3 rounded-xl",
  none: "",
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
