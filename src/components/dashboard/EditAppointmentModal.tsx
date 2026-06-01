"use client";

import { useState, useEffect } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Modal } from "@/components/ui/Modal";

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
  const { appointments, services, therapists, updateAppointment, currentUser } = useSpaData();

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
    } catch (err: any) {
      showToast(err.message || "Cập nhật thất bại. Vui lòng thử lại!", "error");
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
    <Modal
      open={open}
      onClose={onClose}
      variant="drawer"
      title={
        <div>
          <h3 className="font-headline text-xl font-bold text-dark-slate">
            Chi tiết & Chỉnh sửa lịch hẹn
          </h3>
          <p className="text-xs text-on-surface-variant/80 mt-1">
            Khách hàng: <span className="font-bold text-primary">{apt.clientName}</span> ({apt.clientTier})
          </p>
        </div>
      }
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={isLoading} form="edit-appointment-form">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Đang lưu...
              </span>
            ) : currentUser.role === "technician" ? (
              "Cập nhật ghi chú"
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </>
      }
    >
      <form id="edit-appointment-form" onSubmit={handleSubmit} className="space-y-6">
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
              disabled={currentUser.role === "technician"}
              className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20 disabled:bg-surface/55 disabled:text-on-surface-variant/70 disabled:cursor-not-allowed"
            />
            {currentUser.role !== "technician" && (
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
            )}
          </div>

          <Select
            label="Nhân viên đảm nhận"
            value={therapistId}
            onChange={setTherapistId}
            options={therapistOptions}
            disabled={currentUser.role === "technician"}
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
              disabled={currentUser.role === "technician"}
              className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20 disabled:bg-surface/55 disabled:text-on-surface-variant/70 disabled:cursor-not-allowed"
            />
          </div>

          <Select
            label="Trạng thái lịch hẹn"
            value={status}
            onChange={setStatus}
            options={statusOptions}
            disabled={currentUser.role === "technician"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DatePicker
            label="Ngày hẹn"
            value={date}
            onChange={setDate}
            disabled={currentUser.role === "technician"}
          />

          <label className="block text-sm">
            <span className="font-cta mb-1 block text-on-surface-variant font-medium">
              Bắt đầu
            </span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={currentUser.role === "technician"}
              className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20 disabled:bg-surface/55 disabled:text-on-surface-variant/70 disabled:cursor-not-allowed"
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
              disabled={currentUser.role === "technician"}
              className="w-full rounded-xl border border-glass-border bg-white px-4 py-2.5 text-sm text-dark-slate font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:border-primary/40 hover:border-primary/20 disabled:bg-surface/55 disabled:text-on-surface-variant/70 disabled:cursor-not-allowed"
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
      </form>
    </Modal>
  );
}
