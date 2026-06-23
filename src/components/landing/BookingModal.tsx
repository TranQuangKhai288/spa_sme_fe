"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { Select } from "../ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { TimeSlotPicker } from "@/components/ui/TimeSlotPicker";

interface Slot {
  time: string;
  available: boolean;
  busyCount: number;
  totalTherapists: number;
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    serviceRequested: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  // Lấy trạng thái slot khi user chọn ngày
  const fetchSlots = useCallback(async (date: string) => {
    if (!date) { setSlots([]); return; }
    setSlotsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/bookings/availability?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots ?? []);
      }
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  // Tự động fetch khi modal mở và đã có ngày
  useEffect(() => {
    if (open && formData.preferredDate) {
      fetchSlots(formData.preferredDate);
    }
  }, [open, formData.preferredDate, fetchSlots]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, preferredDate: date, preferredTime: "" }));
    if (date) setDateError("");
    fetchSlots(date);
  };

  const handleTimeChange = (time: string) => {
    setFormData((prev) => ({ ...prev, preferredTime: time }));
    if (time) setTimeError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!formData.preferredDate) {
      setDateError("Vui lòng chọn ngày");
      hasError = true;
    } else {
      setDateError("");
    }

    if (!formData.preferredTime) {
      setTimeError("Vui lòng chọn giờ");
      hasError = true;
    } else {
      setTimeError("");
    }

    if (hasError) return;
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Hết lịch – cập nhật lại slot grid và hiện thông báo
        showToast(data.error || "Đã hết lịch vào giờ này.", "error");
        if (data.availableSlotsMessage) {
          setTimeout(() => showToast(data.availableSlotsMessage, "info" as any), 1200);
        }
        // Refresh slots để phản ánh trạng thái mới nhất
        fetchSlots(formData.preferredDate);
      } else if (!res.ok) {
        showToast(data.error || "Có lỗi xảy ra", "error");
      } else {
        if (data.warning) {
          showToast(data.warning, "warning" as any);
        } else {
          showToast("Đặt chỗ thành công! Chúng tôi sẽ liên hệ lại sớm nhất.", "success");
        }
        onClose();
        resetForm();
      }
    } catch {
      showToast("Lỗi mạng, vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      guestName: "",
      guestPhone: "",
      serviceRequested: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
    });
    setSlots([]);
    setDateError("");
    setTimeError("");
  };

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); resetForm(); }}
      title="Đặt chỗ trực tuyến"
      variant="modal"
      maxWidthClassName="sm:max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-label-md text-dark-slate mb-1">Họ và Tên *</label>
          <Input
            name="guestName"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={formData.guestName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-label-md text-dark-slate mb-1">Số điện thoại *</label>
          <Input
            name="guestPhone"
            type="tel"
            placeholder="Ví dụ: 0912345678"
            value={formData.guestPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-label-md text-dark-slate mb-1">Dịch vụ quan tâm</label>
          <Select
            value={formData.serviceRequested}
            onChange={(value) => setFormData((prev) => ({ ...prev, serviceRequested: value }))}
            options={[
              { value: "", label: "Chọn dịch vụ" },
              { value: "Trị Liệu Cổ Vai Gáy", label: "Trị Liệu Cổ Vai Gáy" },
              { value: "Gội Đầu Dưỡng Sinh", label: "Gội Đầu Dưỡng Sinh" },
              { value: "Chăm Sóc Da Mặt VIP", label: "Chăm Sóc Da Mặt VIP" },
              { value: "Tư Vấn Thêm", label: "Cần tư vấn thêm" },
            ]}
          />
        </div>

        {/* Chọn ngày */}
        <div>
          <label className="block font-label-md text-dark-slate mb-1">Ngày *</label>
          <DatePicker
            value={formData.preferredDate}
            onChange={handleDateChange}
            error={dateError}
            placeholder="dd/mm/yyyy"
          />
        </div>

        {/* Chọn giờ – hiện sau khi chọn ngày */}
        <div>
          <label className="block font-label-md text-dark-slate mb-1">
            Giờ *
            {formData.preferredDate && !slotsLoading && (
              <span className="ml-2 text-[10px] font-normal text-on-surface-variant/50">
                (các ô xám đã hết lịch)
              </span>
            )}
          </label>
          <TimeSlotPicker
            slots={slots}
            value={formData.preferredTime}
            onChange={handleTimeChange}
            loading={slotsLoading}
            error={timeError}
          />
        </div>

        <div>
          <label className="block font-label-md text-dark-slate mb-1">Ghi chú (Không bắt buộc)</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full rounded-2xl border border-glass-border bg-white/50 px-4 py-3 font-body-md text-dark-slate outline-none transition-all focus:border-jade-green focus:bg-white"
            placeholder="Bạn có yêu cầu đặc biệt gì không?"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="pt-4 border-t border-glass-border flex justify-end gap-3">
          <Button variant="danger" onClick={() => { onClose(); resetForm(); }} type="button">
            Hủy
          </Button>
          <Button variant="primary" type="submit" disabled={loading || !formData.preferredTime}>
            {loading ? "Đang gửi..." : "Xác nhận đặt chỗ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
