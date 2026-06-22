"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  disabled?: boolean;
  variant?: "default" | "native" | "inline";
  truncate?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  label,
  className = "",
  error,
  disabled = false,
  variant = "default",
  truncate = true,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    openUpward: false,
    alignRight: false,
  });

  const isInline = variant === "inline";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        if ((event.target as Element).closest?.(".select-portal-dropdown")) {
          return;
        }
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollAndResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < 250 && rect.top > 250;

        // Đo chiều rộng dropdown để chống tràn viền phải màn hình
        const dropdownWidth = rect.width;
        const alignRight = rect.left + dropdownWidth > window.innerWidth;

        setCoords({
          top: openUpward ? rect.top : rect.bottom,
          left: alignRight ? Math.max(8, rect.right - dropdownWidth) : rect.left,
          width: rect.width,
          openUpward,
          alignRight,
        });
      }
    };

    handleScrollAndResize();

    window.addEventListener("scroll", handleScrollAndResize, true);
    window.addEventListener("resize", handleScrollAndResize);

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize, true);
      window.removeEventListener("resize", handleScrollAndResize);
    };
  }, [isOpen, isInline]);

  const selectedOption = options.find((opt) => opt.value === value) ?? options[0];

  if (variant === "native") {
    const selectEl = (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full h-10.5 border border-glass-border rounded-xl px-2.5 py-1.5 bg-white/40 text-dark-slate hover:bg-white/60 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer font-semibold text-sm ${disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${label ? "" : className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-dark-slate">
            {opt.label}
          </option>
        ))}
      </select>
    );

    if (label) {
      return (
        <div className={`inline-flex flex-col text-sm ${className}`}>
          <span className="font-cta mb-1 block text-on-surface-variant font-medium">
            {label}
          </span>
          {selectEl}
          {error && (
            <span className="text-red-500 text-xs mt-1 block font-medium">
              {error}
            </span>
          )}
        </div>
      );
    }

    return selectEl;
  }

  const dropdownMenu = isOpen && mounted && (
    <div
      className={`w-full select-portal-dropdown fixed z-[200] max-h-60 overflow-y-auto rounded-xl border border-glass-border/60 bg-white/95 p-1 shadow-2xl backdrop-blur-xl ${coords.openUpward
        ? "bottom-auto mb-1.5 animate-slideUp origin-bottom"
        : "top-auto mt-1.5 animate-slideDown origin-top"
        }`}
      style={{
        top: coords.openUpward ? "auto" : `${coords.top}px`,
        bottom: coords.openUpward ? `${window.innerHeight - coords.top}px` : "auto",
        left: `${coords.left}px`,
        width: `${coords.width}px`,
      }}
    >
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
            className={`w-full text-left rounded-lg transition-colors cursor-pointer ${isInline ? "px-3 py-1.5 text-xs" : "px-3.5 py-2.5 text-sm"
              } ${isSelected
                ? "bg-primary/10 text-primary font-bold"
                : "text-dark-slate hover:bg-primary/5 hover:text-primary font-medium"
              } ${truncate ? "truncate" : ""}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={`relative w-full ${isInline ? "text-xs" : "text-sm"} ${className}`} ref={selectRef}>
      {label && (
        <span className="font-cta mb-1 block text-on-surface-variant font-medium">
          {label}
        </span>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full border flex items-center justify-between text-dark-slate font-bold text-left outline-none transition-all shadow-sm ${isInline
          ? "px-3 py-1.5 text-xs rounded-xl bg-white/40 hover:bg-white/60 focus:bg-white focus:ring-2 focus:ring-primary/20"
          : "h-[42px] px-4 py-2.5 text-sm rounded-xl bg-white focus:ring-4 focus:ring-primary/10 hover:bg-white"
          } ${error ? "border-red-500 focus:border-red-500" : "border-glass-border focus:border-primary/40 hover:border-primary/20"
          } ${disabled ? "bg-surface/50 text-on-surface-variant/70 cursor-not-allowed opacity-80" : "cursor-pointer"
          }`}
      >
        <span className={truncate ? "truncate min-w-0 mr-2" : ""}>{selectedOption?.label ?? ""}</span>
        <ChevronDown
          size={isInline ? 14 : 18}
          className="text-on-surface-variant/80 transition-transform duration-200 ml-1.5 shrink-0"
          style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
        />
      </button>

      {isOpen && mounted && createPortal(dropdownMenu, document.body)}

      {error && (
        <span className="text-red-500 text-xs mt-1 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
