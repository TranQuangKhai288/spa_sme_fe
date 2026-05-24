"use client";

import type { Appointment } from "@/types/spa";
import { formatVnd, statusBadgeClass, tierBadgeClass } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Clock, Trash2 } from "lucide-react";

export interface AppointmentCardProps {
  apt: Appointment;
  onCheckIn?: () => void;
  onCancel?: () => void;
  onDelete: () => void;
  onClick?: () => void;
}

export function AppointmentCard({
  apt,
  onCheckIn,
  onCancel,
  onDelete,
  onClick,
}: AppointmentCardProps) {
  return (
    <GlassCard 
      onClick={onClick}
      className={`p-4 transition-opacity cursor-pointer ${apt.status === "cancelled" ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <img
          src={apt.clientAvatar}
          alt=""
          className="h-12 w-12 shrink-0 rounded-full object-cover border-2 border-primary/10"
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
          <p className="mt-1 text-sm font-medium text-primary">{apt.service}</p>
          <div className="flex items-center gap-3 text-xs text-on-surface-variant/80 mt-0.5">
            <span className="flex items-center gap-1">
              <User size={13} />
              {apt.therapist}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {apt.startTime}–{apt.endTime}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-dark-slate">{formatVnd(apt.price)}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${statusBadgeClass(apt.status)}`}
        >
          {apt.statusLabel}
        </span>
      </div>

      {/* Action buttons */}
      {apt.status !== "cancelled" && apt.status !== "completed" && (
        <div className="mt-3 flex gap-2 border-t border-glass-border pt-3">
          {onCheckIn && (
            <button
              type="button"
              onClick={onCheckIn}
              className="flex-1 rounded-xl bg-primary py-2 text-xs font-bold text-white active:scale-95 transition-all shadow-sm"
            >
              {apt.status === "confirmed" ? "Check-in" : "Hoàn tất"}
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-red-500/20 py-2 text-xs font-bold text-red-500 hover:bg-red-500/5 active:scale-95 transition-all"
            >
              Hủy
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl border border-glass-border px-3 py-2 text-on-surface-variant/50 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center justify-center"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </GlassCard>
  );
}
