"use client";

import Link from "next/link";
import { useSpaData } from "@/hooks/useSpaData";
import { ROUTES } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function PortalProfileView() {
  const { currentUser, spa } = useSpaData();

  return (
    <div className="space-y-6 pb-4">
      <div className="flex flex-col items-center py-4 text-center">
        <img
          src={currentUser.avatar}
          alt=""
          className="mb-4 h-24 w-24 rounded-full border-4 border-jade-green/30 object-cover"
        />
        <h1 className="font-headline text-2xl font-bold">{currentUser.name}</h1>
        <p className="text-sm text-on-surface-variant">{currentUser.role}</p>
      </div>

      <GlassCard className="divide-y divide-glass-border/30 p-0">
        {[
          {
            icon: "calendar_month",
            label: `Lịch hẹn của tôi`,
            href: ROUTES.portalAppointments,
          },
          {
            icon: "spa",
            label: `Tiến độ liệu trình`,
            href: ROUTES.portalTreatments,
          },
          {
            icon: "notifications",
            label: `Thông báo`,
            href: ROUTES.portalNotifications,
          },
          {
            icon: "dashboard",
            label: `Portal`,
            href: ROUTES.dashboard,
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/30"
          >
            <MaterialIcon name={item.icon} className="text-jade-green" />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <MaterialIcon
              name="chevron_right"
              className="text-on-surface-variant"
            />
          </Link>
        ))}
      </GlassCard>

      <GlassCard className="p-5 text-sm text-on-surface-variant">
        <p className="font-semibold text-dark-slate">{spa.name}</p>
        <p className="mt-1">{spa.phone}</p>
        <p>{spa.email}</p>
        <p className="mt-2 text-xs">v{spa.version}</p>
      </GlassCard>
    </div>
  );
}
