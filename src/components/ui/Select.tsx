"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  className?: string;
  error?: string;
}

export function Select({
  value,
  onChange,
  options,
  label,
  className = "",
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) ?? options[0];

  return (
    <div className={`relative text-sm w-full ${className}`} ref={selectRef}>
      {label && (
        <span className="font-cta mb-1 block text-on-surface-variant font-medium">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm flex items-center justify-between text-dark-slate font-semibold text-left outline-none focus:ring-4 focus:ring-primary/10 transition-all hover:bg-white shadow-sm ${
          error ? "border-red-500 focus:border-red-500" : "border-glass-border focus:border-primary/40 hover:border-primary/20"
        }`}
      >
        <span>{selectedOption?.label ?? ""}</span>
        <ChevronDown
          size={18}
          className="text-on-surface-variant/80 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-full max-h-60 overflow-y-auto rounded-xl border border-glass-border/60 bg-white/95 p-1 shadow-2xl backdrop-blur-xl animate-fadeIn">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 text-left text-sm rounded-lg transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-dark-slate hover:bg-primary/5 hover:text-primary font-medium"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
      {error && (
        <span className="text-red-500 text-xs mt-1 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
