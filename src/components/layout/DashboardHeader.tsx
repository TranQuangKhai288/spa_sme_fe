"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useSpaData } from "@/hooks/useSpaData";

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
  const { currentUser, notifications } = useSpaData();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 right-0 z-40 flex h-16 w-full items-center justify-between gap-2 border-b border-glass-border bg-glass-bg px-4 backdrop-blur-[20px] sm:h-20 sm:px-6 lg:left-64 lg:w-[calc(100%-16rem)]">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={onMenuOpen}
          className="shrink-0 rounded-xl p-2 hover:bg-white/40 lg:hidden"
          aria-label={`Mở menu`}
        >
          <MaterialIcon name="menu" className="text-dark-slate" />
        </button>

        <div className="min-w-0 flex-1">
          <nav className="font-cta mb-0.5 hidden items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant sm:flex">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {i > 0 && (
                  <MaterialIcon name="chevron_right" className="text-[10px]" />
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

        <div className="relative hidden lg:block">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60"
          />
          <input
            type="search"
            placeholder={`Tìm khách, lịch hẹn...`}
            className="w-48 rounded-full border border-glass-border bg-white/30 py-2 pl-10 pr-4 text-sm outline-none focus:border-primary/40 xl:w-64"
          />
        </div>

        <button
          type="button"
          className="relative rounded-full p-2 transition-colors hover:bg-white/40"
          aria-label={`Thông báo`}
        >
          <MaterialIcon
            name="notifications"
            className="text-dark-slate text-[22px]"
          />
          {unread > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="hidden h-9 w-9 rounded-full border-2 border-primary/20 object-cover sm:block sm:h-10 sm:w-10"
        />

        {onCreateAppointment && (
          <Button
            size="sm"
            onClick={onCreateAppointment}
            className="hidden sm:inline-flex"
            icon={<MaterialIcon name="add" className="text-[16px]" />}
          >
            <span className="hidden md:inline">{`Tạo lịch hẹn`}</span>
            <span className="md:hidden">{`Tạo`}</span>
          </Button>
        )}
        {onCreateAppointment && (
          <button
            type="button"
            onClick={onCreateAppointment}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md sm:hidden"
            aria-label={`Tạo lịch hẹn`}
          >
            <MaterialIcon name="add" className="text-[20px]" />
          </button>
        )}
      </div>
    </header>
  );
}
