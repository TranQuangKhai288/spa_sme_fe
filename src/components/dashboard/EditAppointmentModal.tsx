"use client";

import { useState, useEffect } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { X, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";

export interface EditAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  aptId: string | null;
}

export function EditAppointmentModal({
  open,
  onClose,
  aptId,
}: EditAppointmentModalProps) {
  const { appointments, services, therapists, updateAppointment } = useSpaData();

  const apt = appointments.find((a) => a.id === aptId);

  const [serviceName, setServiceName] = useState("");
  const [therapistId, setTherapistId] = useState("");
  const [price, setPrice] = useState("0");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:30");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatNumberString = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) return "";
    return new Intl.NumberFormat("vi-VN").format(Number(clean));
  };

  // Sync state when modal opens or appointment changes
  useEffect(() => {
    if (apt) {
      setServiceName(apt.service ?? "");
      setTherapistId(apt.therapistId);
      setPrice(formatNumberString(String(apt.price)));
      setNotes(apt.notes ?? "");
      setStartTime(apt.startTime);
      setEndTime(apt.endTime);
      setDate(apt.date);
      setStatus(apt.status);
    }
  }, [apt, services, open]);

  if (!open || !apt) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const numericPrice = Number(price.replace(/\./g, "")) || 0;

      await updateAppointment(apt.id, {
        service: serviceName.trim() || null as any,
        serviceIcon: serviceName.trim() ? "spa" : null as any,
        therapistId,
        startTime,
        endTime,
        date,
        price: numericPrice,
        notes: notes.trim() || null as any,
        status,
      });
      showToast("Cập nhật lịch hẹn thành công!", "success");
      onClose();
    } catch (err) {
      showToast("Cập nhật thất bại. Vui lòng thử lại!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const therapistOptions = therapists.map((t) => ({
    value: t.id,
    label: `${t.name} — ${t.specialty}`,
  }));

  const statusOptions = [
    { value: "confirmed", label: "Đã xác nhận (Confirmed)" },
    { value: "in_progress", label: "Đang xử lý (In Progress)" },
    { value: "completed", label: "Hoàn tất (Completed)" },
    { value: "cancelled", label: "Đã hủy (Cancelled)" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-end md:items-stretch bg-dark-slate/40 backdrop-blur-sm animate-fadeInBackdrop">
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10 cursor-default" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="drawer-panel glass-card flex flex-col w-full md:w-1/2 md:max-w-2xl h-[85dvh] md:h-full rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-t md:border-t-0 md:border-l border-white/50 shadow-2xl p-0 overflow-hidden bg-white/30 backdrop-blur-3xl"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-glass-border flex items-center justify-between shrink-0 bg-white/40">
          <div>
            <h3 className="font-headline text-xl font-bold text-dark-slate">
              Chi tiết & Chỉnh sửa lịch hẹn
            </h3>
            <p className="text-xs text-on-surface-variant/80 mt-1">
              Khách hàng: <span className="font-bold text-primary">{apt.clientName}</span> ({apt.clientTier})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/50 flex items-center justify-center text-on-surface-variant/80 hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Client summary block */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-glass-border shadow-sm">
            <img
              src={apt.clientAvatar}
              alt=""
              className="h-12 w-12 rounded-full object-cover border border-glass-border shadow-sm"
            />
            <div>
              <p className="font-bold text-dark-slate">{apt.clientName}</p>
              <p className="text-xs text-on-surface-variant/85">Lịch hẹn ID: {apt.id}</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {apt.clientTier}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm w-full">
              <span className="font-cta mb-1 block text-on-surface-variant font-medium">
                Dịch vụ trị liệu (Nhập tự do hoặc chọn nhanh)
              </span>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Ví dụ: Massage đá nóng, Laser trẻ hóa..."
                className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20"
              />
              <div className="mt-2.5 flex flex-wrap gap-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setServiceName(s.name);
                      setPrice(formatNumberString(String(s.price)));
                    }}
                    className="text-[11px] font-bold bg-primary/5 hover:bg-primary text-primary hover:text-white border border-primary/15 hover:border-primary rounded-full px-3 py-1.5 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                  >
                    + {s.name}
                  </button>
                ))}
              </div>
            </div>

            <Select
              label="Nhân viên đảm nhận"
              value={therapistId}
              onChange={setTherapistId}
              options={therapistOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm w-full">
              <span className="font-cta mb-1 block text-on-surface-variant font-medium">
                Chi phí / Giá tiền (VND)
              </span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(formatNumberString(e.target.value))}
                placeholder="0"
                className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20"
              />
            </div>

            <Select
              label="Trạng thái lịch hẹn"
              value={status}
              onChange={setStatus}
              options={statusOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DatePicker
              label="Ngày hẹn"
              value={date}
              onChange={setDate}
            />

            <label className="block text-sm">
              <span className="font-cta mb-1 block text-on-surface-variant font-medium">
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
              <span className="font-cta mb-1 block text-on-surface-variant font-medium">
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
              Ghi chú chi tiết
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thêm các yêu cầu đặc biệt của khách hàng hoặc chi tiết liệu trình..."
              rows={4}
              className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 border-t border-glass-border bg-white/50 backdrop-blur-md flex justify-end gap-3 shrink-0">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Đang lưu...
              </span>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
