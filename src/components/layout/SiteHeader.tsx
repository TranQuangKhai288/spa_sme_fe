"use client";

import Link from "next/link";
import { useState } from "react";
import { ROUTES } from "@/lib/constants";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  active?: "home" | "portal" | "booking" | "dashboard";
}

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/#services", label: `Dịch vụ`, id: "home" as const },
    {
      href: ROUTES.dashboard,
      label: `Portal`,
      id: "dashboard" as const,
    },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-glass-border bg-glass-bg backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-18 sm:px-6">
        <Link
          href={ROUTES.home}
          className="font-headline text-xl font-black text-jade-green sm:text-2xl"
        >
          {`ZenFlow`}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "hover:text-primary",
                active === l.id && "font-semibold text-primary",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex sm:gap-3">
          <LanguageSwitcher />
          <Link href={ROUTES.booking}>
            <Button size="sm">{`Đặt lịch`}</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="rounded-xl p-2 hover:bg-white/40"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={`Menu`}
          >
            <MaterialIcon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-glass-border bg-surface px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
          <Link href={ROUTES.booking} onClick={() => setMenuOpen(false)}>
            <Button className="mt-2 w-full">{`Đặt lịch ngay`}</Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
