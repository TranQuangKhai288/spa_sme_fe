"use client";

import { useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

export interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAppointmentModal({
  open,
  onClose,
}: CreateAppointmentModalProps) {
  const { clients, services, therapists, addAppointment } = useSpaData();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [therapistId, setTherapistId] = useState(therapists[0]?.id ?? "");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:30");

  if (!open) return null;

  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const service = services.find((s) => s.id === serviceId) ?? services[0];
  const therapist =
    therapists.find((t) => t.id === therapistId) ?? therapists[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !service || !therapist) return;

    addAppointment({
      clientId: client.id,
      clientName: client.name,
      clientTier: client.tier,
      clientAvatar: client.avatar,
      service: service.name,
      serviceIcon: "spa",
      therapist: therapist.name,
      therapistId: therapist.id,
      startTime,
      endTime,
      date: new Date().toISOString().slice(0, 10),
      price: service.price,
    });
    showToast(`Đã tạo lịch hẹn cho ${client.name}!`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center bg-dark-slate/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="glass-card max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/50 p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-headline text-xl font-bold text-dark-slate">
            {`Tạo lịch hẹn mới`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/50"
            aria-label={`Đóng`}
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="font-cta mb-1 block text-on-surface-variant">
              {`Khách hàng`}
            </span>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.tier}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-cta mb-1 block text-on-surface-variant">
              {`Dịch vụ`}
            </span>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration} phút)
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-cta mb-1 block text-on-surface-variant">
              {`Kỹ thuật viên`}
            </span>
            <select
              value={therapistId}
              onChange={(e) => setTherapistId(e.target.value)}
              className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm"
            >
              {therapists.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.specialty}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="font-cta mb-1 block text-on-surface-variant">
                {`Bắt đầu`}
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-cta mb-1 block text-on-surface-variant">
                {`Kết thúc`}
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              {`Hủy`}
            </Button>
            <Button type="submit">{`Xác nhận lịch hẹn`}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
