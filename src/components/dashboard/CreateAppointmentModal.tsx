"use client";

import { useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Modal } from "@/components/ui/Modal";

export interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (date: string) => void;
}

export function CreateAppointmentModal({
  open,
  onClose,
  onSuccess,
}: CreateAppointmentModalProps) {
  const { clients, services, therapists, addAppointment, appointments } = useSpaData();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [therapistId, setTherapistId] = useState(therapists[0]?.id ?? "");
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("0");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:30");
  const [date, setDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [isLoading, setIsLoading] = useState(false);

  const formatNumberString = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) return "";
    return new Intl.NumberFormat("vi-VN").format(Number(clean));
  };

  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const therapist =
    therapists.find((t) => t.id === therapistId) ?? therapists[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !therapist) return;

    // Kiểm tra trùng khung giờ cho cùng nhân viên và ngày
    const newStart = Number(startTime.split(':')[0]) * 60 + Number(startTime.split(':')[1]);
    const newEnd = Number(endTime.split(':')[0]) * 60 + Number(endTime.split(':')[1]);
    const hasConflict = appointments.some((apt) => {
      return (
        apt.therapistId === therapistId &&
        apt.date === date &&
        apt.status !== "cancelled" &&
        (() => {
          const existStart = Number(apt.startTime.split(':')[0]) * 60 + Number(apt.startTime.split(':')[1]);
          const existEnd = Number(apt.endTime.split(':')[0]) * 60 + Number(apt.endTime.split(':')[1]);
          return !(newEnd <= existStart || newStart >= existEnd);
        })()
      );
    });
    if (hasConflict) {
      showToast("Khung giờ đã bị trùng. Vui lòng chọn thời gian khác.", "error");
      return;
    }

    const numericPrice = Number(price.replace(/\./g, "")) || 0;
    setIsLoading(true);
    try {
      await addAppointment({
        clientId: client.id,
        clientName: client.name,
        clientTier: client.tier,
        clientAvatar: client.avatar,
        service: serviceName.trim() || undefined,
        serviceIcon: serviceName.trim() ? "spa" : undefined,
        therapist: therapist.name,
        therapistId: therapist.id,
        startTime,
        endTime,
        date,
        price: numericPrice,
        notes: notes.trim() || undefined,
      });
      showToast(`Đã tạo lịch hẹn cho ${client.name}!`, "success");
      onSuccess?.(date);
      onClose();
    } catch {
      showToast("Tạo lịch hẹn thất bại. Vui lòng thử lại!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: `${c.name} — ${c.tier}`,
  }));

  const therapistOptions = therapists.map((t) => ({
    value: t.id,
    label: `${t.name} — ${t.specialty}`,
  }));

  return (
    <Modal open={open} onClose={onClose} title="Tạo lịch hẹn mới">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Khách hàng"
          value={clientId}
          onChange={setClientId}
          options={clientOptions}
        />

        <Select
          label="Nhân viên đảm nhận"
          value={therapistId}
          onChange={setTherapistId}
          options={therapistOptions}
        />

        <div className="text-sm w-full">
          <span className="font-cta mb-1 block text-on-surface-variant font-medium">
            Dịch vụ yêu cầu (Nhập tự do hoặc chọn nhanh)
          </span>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Ví dụ: Massage cổ vai gáy, Thủy trị liệu..."
            className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20"
          />
          <div className="mt-2.5 flex flex-wrap gap-2">
            {services.map((s) => (
              <Button
                key={s.id}
                type="button"
                variant="pill"
                size="none"
                onClick={() => {
                  setServiceName(s.name);
                  setPrice(formatNumberString(String(s.price)));
                }}
                className="px-3 py-1.5"
              >
                + {s.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            label="Ngày hẹn"
            value={date}
            onChange={setDate}
          />

          <div className="text-sm w-full">
            <span className="font-cta mb-1 block text-on-surface-variant font-medium">
              Chi phí dự kiến (VND)
            </span>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(formatNumberString(e.target.value))}
              placeholder="0"
              className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="font-cta mb-1 block text-on-surface-variant">
              Bắt đầu
            </span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20"
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
              className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20"
            />
          </label>
        </div>

        <div className="text-sm w-full">
          <span className="font-cta mb-1 block text-on-surface-variant font-medium">
            Ghi chú ban đầu
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú đặt lịch..."
            rows={3}
            className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Đang tạo...
              </span>
            ) : (
              "Xác nhận lịch hẹn"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
