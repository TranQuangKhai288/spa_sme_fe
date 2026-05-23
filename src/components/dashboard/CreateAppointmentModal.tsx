"use client";

import { useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { X } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";

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
  const [date, setDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

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
      date,
      price: service.price,
    });
    showToast(`Đã tạo lịch hẹn cho ${client.name}!`, "success");
    onClose();
  };

  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: `${c.name} — ${c.tier}`,
  }));

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.duration} phút)`,
  }));

  const therapistOptions = therapists.map((t) => ({
    value: t.id,
    label: `${t.name} — ${t.specialty}`,
  }));

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center bg-dark-slate/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="glass-card max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/50 p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-headline text-xl font-bold text-dark-slate">
            Tạo lịch hẹn mới
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/50 flex items-center justify-center text-on-surface-variant/80 hover:text-on-surface"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Khách hàng"
            value={clientId}
            onChange={setClientId}
            options={clientOptions}
          />

          <Select
            label="Dịch vụ"
            value={serviceId}
            onChange={setServiceId}
            options={serviceOptions}
          />

          <Select
            label="Kỹ thuật viên"
            value={therapistId}
            onChange={setTherapistId}
            options={therapistOptions}
          />

          <DatePicker
            label="Ngày hẹn"
            value={date}
            onChange={setDate}
          />

          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="font-cta mb-1 block text-on-surface-variant">
                Bắt đầu
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm text-dark-slate font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all hover:bg-white/70"
              />
            </label>
            <label className="block text-sm">
              <span className="font-cta mb-1 block text-on-surface-variant">
                Kết thúc
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm text-dark-slate font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all hover:bg-white/70"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Xác nhận lịch hẹn</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
