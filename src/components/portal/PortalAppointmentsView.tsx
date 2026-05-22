"use client";

import Link from "next/link";
import { useSpaData } from "@/hooks/useSpaData";
import { ROUTES } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { statusBadgeClass } from "@/lib/utils";

export function PortalAppointmentsView() {
  const { appointments, currentUser } = useSpaData();
  const mine = appointments.filter(
    (a) => a.clientName === currentUser.name || a.status !== "cancelled",
  );

  if (mine.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center py-8 text-center">
        <GlassCard className="w-full p-10">
          <MaterialIcon
            name="event_busy"
            className="mb-4 text-5xl text-on-surface-variant/40"
          />
          <h2 className="font-headline text-xl font-semibold">
            {`Chưa có lịch hẹn`}
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            {`Chưa có lịch hẹn sắp tới`}
          </p>
          <Link href={ROUTES.booking} className="mt-6 block">
            <Button className="w-full">{`Đặt lịch ngay`}</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <h1 className="font-headline text-2xl font-bold">{`Lịch hẹn của tôi`}</h1>
      {mine.map((apt) => (
        <GlassCard key={apt.id} className="p-4">
          <div className="flex justify-between gap-2">
            <div>
              <p className="font-semibold">{apt.service}</p>
              <p className="text-xs text-on-surface-variant">
                {apt.date} • {apt.startTime}–{apt.endTime}
              </p>
              <p className="text-xs text-on-surface-variant">{apt.therapist}</p>
            </div>
            <span
              className={`h-fit shrink-0 rounded-full px-2 py-1 text-[9px] font-bold uppercase ${statusBadgeClass(apt.status)}`}
            >
              {apt.statusLabel}
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
