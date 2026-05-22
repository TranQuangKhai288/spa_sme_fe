import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl border border-white/40",
        hover && "glass-glow-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
