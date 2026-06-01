"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { NotificationsDropdown } from "@/components/ui/NotificationsDropdown";
import { useSpaData } from "@/hooks/useSpaData";
import { useSearch } from "@/providers/SearchProvider";
import { Select } from "@/components/ui/Select";
import { Menu, ChevronRight, Search, X, Plus } from "lucide-react";

export interface DashboardHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  onCreateAppointment?: () => void;
  onMenuOpen: () => void;
}

export function DashboardHeader({
  breadcrumbs,
  onCreateAppointment,
  onMenuOpen,
}: DashboardHeaderProps) {
  const { currentUser, switchRole } = useSpaData();
  const { query, setQuery, placeholder } = useSearch();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset search when navigating to a different page
  useEffect(() => {
    setQuery("");
  }, [pathname, setQuery]);

  // Cmd/Ctrl+K shortcut to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const roleOptions = [
    { value: "admin", label: "Quản trị viên" },
    { value: "cashier", label: "Thu ngân" },
    { value: "technician", label: "Kỹ thuật viên" },
  ];

  return (
    <header className="fixed top-0 right-0 z-40 flex h-16 w-full items-center justify-between gap-2 border-b border-glass-border bg-glass-bg px-4 backdrop-blur-[20px] sm:h-20 sm:px-6 lg:left-64 lg:w-[calc(100%-16rem)]">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <Button
          type="button"
          variant="icon"
          size="none"
          onClick={onMenuOpen}
          className="shrink-0 rounded-xl p-2 hover:bg-white/40 lg:hidden text-dark-slate"
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </Button>

        {/* Breadcrumbs — hidden when search is active on mobile */}
        <div className="min-w-0 flex-1 hidden sm:block">
          <nav className="font-cta mb-0.5 hidden items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant sm:flex">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {i > 0 && (
                  <ChevronRight size={10} className="text-on-surface-variant/60" />
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-jade-green">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h2 className="truncate font-headline text-sm font-semibold text-dark-slate sm:text-lg">
            {breadcrumbs[breadcrumbs.length - 1]?.label ?? currentUser.greeting}
          </h2>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <LanguageSwitcher className="hidden sm:flex" />

        {/* ─── GLOBAL SEARCH ─── */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 pointer-events-none"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-36 sm:w-48 xl:w-64 rounded-full border border-glass-border bg-white/30 py-2 pl-9 pr-9 text-sm outline-none focus:border-primary/40 focus:bg-white/60 focus:w-52 sm:focus:w-64 xl:focus:w-80 transition-all duration-300"
          />
          {query && (
            <Button
              variant="icon"
              size="none"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant p-1 shadow-none"
            >
              <X size={16} />
            </Button>
          )}
        </div>

        <NotificationsDropdown />

        {/* Role Switcher Dropdown */}
        <Select
          value={currentUser.role}
          onChange={switchRole}
          options={roleOptions}
          variant="inline"
          className="mr-1 sm:mr-2 w-32 sm:w-40 font-bold"
        />

        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="hidden h-9 w-9 rounded-full border-2 border-primary/20 object-cover sm:block sm:h-10 sm:w-10"
          title={`${currentUser.name} (${currentUser.role})`}
        />

        {onCreateAppointment && (
          <div className="hidden sm:block">
            <Button
              size="sm"
              onClick={onCreateAppointment}
              icon={<Plus size={16} />}
            >
              <span className="hidden md:inline">Tạo lịch hẹn</span>
              <span className="md:hidden">Tạo</span>
            </Button>
          </div>
        )}
        {onCreateAppointment && (
          <Button
            type="button"
            onClick={onCreateAppointment}
            variant="icon"
            size="none"
            className="flex h-9 w-9 bg-primary text-white shadow-md sm:hidden rounded-full hover:brightness-110 border-none"
            aria-label="Tạo lịch hẹn"
          >
            <Plus size={20} />
          </Button>
        )}
      </div>
    </header>
  );
}
