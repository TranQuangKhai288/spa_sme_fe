"use client";

import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="text-sm w-full">
      {label && (
        <span className="font-cta mb-1 block text-on-surface-variant font-medium">
          {label}
        </span>
      )}
      <textarea
        {...props}
        className={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-dark-slate placeholder-on-surface-variant/40 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-glass-border focus:border-primary/40 hover:border-primary/20"
        } ${className}`}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
