"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { Select } from "../ui/Select";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    serviceRequested: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Có lỗi xảy ra", "error");
      } else {
        showToast("Đặt chỗ thành công! Chúng tôi sẽ liên hệ lại sớm nhất.", "success");
        onClose();
        // Reset form
        setFormData({
          guestName: "",
          guestPhone: "",
          serviceRequested: "",
          preferredDate: "",
          preferredTime: "",
          notes: "",
        });
      }
    } catch (err) {
      showToast("Lỗi mạng, vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md text-dark-slate mb-1">Ngày *</label>
            <Input
              name="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-label-md text-dark-slate mb-1">Giờ *</label>
            <Input
              name="preferredTime"
              type="time"
              value={formData.preferredTime}
              onChange={handleChange}
              required
            />
          </div>
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
          <Button variant="danger" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Xác nhận đặt chỗ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
