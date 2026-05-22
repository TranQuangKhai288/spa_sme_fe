"use client";

import { useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { formatVnd, statusBadgeClass, tierBadgeClass } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { AppointmentCard } from "./AppointmentCard";

const FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "in_progress", label: "Đang xử lý" },
  { id: "completed", label: "Hoàn tất" },
  { id: "cancelled", label: "Đã hủy" },
] as const;

export function AppointmentsView() {
  const { appointments, updateAppointmentStatus, deleteAppointment } =
    useSpaData();
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-dark-slate sm:text-3xl">
            Quản lý lịch hẹn
          </h1>
          <p className="text-sm text-on-surface-variant/80">
            {filtered.length} lịch hẹn
          </p>
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                filter === f.id
                  ? "bg-primary text-white"
                  : "bg-white/40 text-on-surface-variant hover:bg-white/60"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <GlassCard className="p-10 text-center text-sm text-on-surface-variant">
            Không có lịch hẹn
          </GlassCard>
        ) : (
          filtered.map((apt) => (
            <AppointmentCard
              key={apt.id}
              apt={apt}
              onCheckIn={
                apt.status === "confirmed"
                  ? () => updateAppointmentStatus(apt.id, "in_progress")
                  : undefined
              }
              onDelete={() => deleteAppointment(apt.id)}
            />
          ))
        )}
      </div>

      {/* Desktop: table */}
      <GlassCard className="hidden overflow-hidden p-0 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left">
            <thead>
              <tr className="border-b border-glass-border bg-white/30">
                {[
                  "Khách hàng",
                  "Dịch vụ",
                  "KTV",
                  "Giờ",
                  "Giá",
                  "Trạng thái",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="font-cta px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/20">
              {filtered.map((apt) => (
                <tr
                  key={apt.id}
                  className="transition-colors hover:bg-white/25"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={apt.clientAvatar}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-dark-slate">
                          {apt.clientName}
                        </p>
                        <span
                          className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${tierBadgeClass(apt.clientTier)}`}
                        >
                          {apt.clientTier}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{apt.service}</td>
                  <td className="px-6 py-4 text-sm">{apt.therapist}</td>
                  <td className="px-6 py-4 text-sm">
                    {apt.startTime} – {apt.endTime}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatVnd(apt.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusBadgeClass(apt.status)}`}
                    >
                      {apt.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      {apt.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() =>
                            updateAppointmentStatus(apt.id, "in_progress")
                          }
                          className="rounded-lg bg-primary px-2 py-1 text-[10px] text-white"
                        >
                          Check-in
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteAppointment(apt.id)}
                        className="rounded-lg p-1 hover:bg-red-500/10"
                      >
                        <MaterialIcon
                          name="delete"
                          className="text-[18px] text-on-surface-variant"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
