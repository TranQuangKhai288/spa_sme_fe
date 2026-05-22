"use client";

import type { Appointment } from "@/types/spa";
import { formatVnd, statusBadgeClass, tierBadgeClass } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export interface AppointmentCardProps {
  apt: Appointment;
  onCheckIn?: () => void;
  onDelete: () => void;
}

export function AppointmentCard({
  apt,
  onCheckIn,
  onDelete,
}: AppointmentCardProps) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start gap-3">
        <img
          src={apt.clientAvatar}
          alt=""
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-dark-slate">{apt.clientName}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${tierBadgeClass(apt.clientTier)}`}
            >
              {apt.clientTier}
            </span>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">{apt.service}</p>
          <p className="text-xs text-on-surface-variant/80">
            {apt.therapist} • {apt.startTime}–{apt.endTime}
          </p>
          <p className="mt-1 text-sm font-medium">{formatVnd(apt.price)}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold uppercase ${statusBadgeClass(apt.status)}`}
        >
          {apt.statusLabel}
        </span>
      </div>
      <div className="mt-3 flex gap-2 border-t border-glass-border pt-3">
        {apt.status === "confirmed" && onCheckIn && (
          <button
            type="button"
            onClick={onCheckIn}
            className="flex-1 rounded-lg bg-primary py-2 text-xs font-medium text-white"
          >
            Check-in
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-500"
        >
          <MaterialIcon name="delete" className="text-[18px]" />
        </button>
      </div>
    </GlassCard>
  );
}
