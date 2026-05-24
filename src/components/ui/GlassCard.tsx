import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl border border-white/40",
        hover && "glass-glow-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

