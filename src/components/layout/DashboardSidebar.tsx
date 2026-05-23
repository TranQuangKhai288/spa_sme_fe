"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type DashboardNavId } from "@/lib/constants";
import { useDashboardNav } from "@/hooks/useDashboardNav";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Users,
  BarChart3,
  Zap,
  Settings,
  HelpCircle,
  X
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  dashboard: LayoutDashboard,
  calendar_month: Calendar,
  spa: Sparkles,
  person_search: Users,
  analytics: BarChart3,
  bolt: Zap,
  settings: Settings,
  contact_support: HelpCircle,
  close: X
};

function activeNavId(pathname: string): DashboardNavId {
  if (pathname.startsWith("/dashboard/appointments")) return "appointments";
  if (pathname.startsWith("/dashboard/customers")) return "customers";
  if (pathname.startsWith("/dashboard/workflows")) return "workflows";
  if (pathname.startsWith("/dashboard/services")) return "services";
  if (pathname.startsWith("/dashboard/reports")) return "reports";
  if (pathname === "/dashboard") return "dashboard";
  return "dashboard";
}

export interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const active = activeNavId(pathname);
  const nav = useDashboardNav();

  return (
    <>
      <button
        type="button"
        aria-label={`Đóng menu`}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-dark-slate/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <nav
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[min(280px,85vw)] flex-col border-r border-glass-border bg-surface py-6 transition-transform duration-300 ease-out lg:w-64 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center justify-between px-6">
          <Link href="/dashboard" className="block" onClick={onClose}>
            <h1 className="font-headline text-2xl font-black tracking-tight text-jade-green">
              {`ZenFlow`}
            </h1>
            <p className="font-cta text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
              {`Cổng vận hành`}
            </p>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/50 lg:hidden flex items-center justify-center text-on-surface-variant"
            aria-label={`Đóng menu`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const isActive = active === item.id;
            const IconComponent = iconMap[item.icon] || LayoutDashboard;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "font-cta mx-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-[0_4px_12px_rgba(0,107,94,0.2)] lg:translate-x-1"
                    : "text-on-surface-variant hover:text-primary",
                )}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mb-4 px-6">
          <Link
            href="/booking"
            onClick={onClose}
            className="font-cta block w-full rounded-xl bg-secondary-container py-3 text-center text-sm font-medium text-on-secondary-container shadow-sm transition-all hover:brightness-95"
          >
            Đặt lịch công khai
          </Link>
        </div>

        <div className="mt-auto border-t border-surface-container px-6 pt-4">
          <LanguageSwitcher className="w-full justify-center" />
          <a
            href="#settings"
            className="font-cta mx-2 mt-2 flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            <Settings size={18} />
            <span>{`Cài đặt`}</span>
          </a>
          <a
            href="#support"
            className="font-cta mx-2 flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            <HelpCircle size={18} />
            <span>{`Hỗ trợ`}</span>
          </a>
        </div>
      </nav>
    </>
  );
}
