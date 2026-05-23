"use client";

import { useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

export interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
}

const TIERS = ["Bạc", "Vàng", "Bạch Kim", "Kim Cương"];

export function CreateClientModal({ open, onClose }: CreateClientModalProps) {
  const { addClient } = useSpaData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("Bạc");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  if (!open) return null;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên khách hàng";
    }
    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 03, 05, 07, 08, 09)";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Email không đúng định dạng";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const randomImgId = Math.floor(Math.random() * 70) + 1;
    const avatar = `https://i.pravatar.cc/150?img=${randomImgId}`;

    addClient({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      tier,
      notes: notes.trim(),
      avatar,
    });

    showToast(`Đã thêm khách hàng ${name.trim()} thành công!`, "success");
    
    // Reset form
    setName("");
    setPhone("");
    setEmail("");
    setTier("Bạc");
    setNotes("");
    setErrors({});
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center bg-dark-slate/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="glass-card max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/50 p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8 animate-fadeIn">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-headline text-xl font-bold text-dark-slate flex items-center gap-2">
            <MaterialIcon name="person_add" className="text-jade-green" />
            Thêm khách hàng mới
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/50 text-on-surface-variant transition-colors"
            aria-label="Đóng"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="font-cta mb-1 block text-on-surface-variant font-medium">
              Họ và tên <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              placeholder="VD: Nguyễn Văn A"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.name ? "border-red-500 focus:border-red-500" : "border-glass-border focus:border-primary/40"
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1 block font-medium">{errors.name}</span>
            )}
          </label>

          <label className="block text-sm">
            <span className="font-cta mb-1 block text-on-surface-variant font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </span>
            <input
              type="tel"
              placeholder="VD: 0912345678"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              className={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.phone ? "border-red-500 focus:border-red-500" : "border-glass-border focus:border-primary/40"
              }`}
            />
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1 block font-medium">{errors.phone}</span>
            )}
          </label>

          <label className="block text-sm">
            <span className="font-cta mb-1 block text-on-surface-variant font-medium">
              Email
            </span>
            <input
              type="email"
              placeholder="VD: customer@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.email ? "border-red-500 focus:border-red-500" : "border-glass-border focus:border-primary/40"
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block font-medium">{errors.email}</span>
            )}
          </label>

          <label className="block text-sm">
            <span className="font-cta mb-1 block text-on-surface-variant font-medium">
              Hạng thành viên
            </span>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer"
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-cta mb-1 block text-on-surface-variant font-medium">
              Ghi chú thêm
            </span>
            <textarea
              placeholder="Ghi chú sở thích, lưu ý y tế hoặc tình trạng da..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
            />
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Xác nhận thêm</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
