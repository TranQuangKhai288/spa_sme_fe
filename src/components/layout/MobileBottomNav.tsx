"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeMobileNavId, shouldShowMobileNav } from "@/lib/constants";
import { useDashboardNav } from "@/hooks/useDashboardNav";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function MobileBottomNav() {
  const pathname = usePathname();
  const nav = useDashboardNav(true);

  if (!shouldShowMobileNav(pathname)) return null;

  const active = activeMobileNavId(pathname);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-glass-border bg-glass-bg shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:hidden"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch justify-between gap-0.5 overflow-x-auto px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 scrollbar-hide">
        {nav.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex min-w-13 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1.5 transition-all duration-200 active:scale-95",
                isActive
                  ? "bg-primary-container/20 text-primary"
                  : "text-on-surface-variant opacity-75 hover:text-primary",
              )}
            >
              <MaterialIcon
                name={item.icon}
                className="text-[20px] sm:text-[22px]"
                filled={isActive}
              />
              <span className="font-cta mt-0.5 max-w-full truncate text-center text-[8px] font-bold uppercase tracking-wide sm:text-[9px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
