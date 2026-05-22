"use client";

import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass-card flex items-center gap-0.5 rounded-full border border-white/40 p-0.5",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className="font-cta rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary text-white"
        aria-pressed
      >
        VI
      </button>
    </div>
  );
}
