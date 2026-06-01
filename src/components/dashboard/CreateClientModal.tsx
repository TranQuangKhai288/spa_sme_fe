"use client";

import { useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";

export interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
}

const TIERS = ["Bạc", "Vàng", "Bạch Kim", "Kim Cương"];
const tierOptions = TIERS.map((t) => ({ value: t, label: t }));

export function CreateClientModal({ open, onClose }: CreateClientModalProps) {
  const { addClient } = useSpaData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("Bạc");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const randomImgId = Math.floor(Math.random() * 70) + 1;
    const avatar = `https://i.pravatar.cc/150?img=${randomImgId}`;

    setIsLoading(true);
    try {
      await addClient({
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
    } catch {
      showToast("Thêm khách hàng thất bại. Vui lòng thử lại!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Thêm khách hàng mới">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Họ và tên *"
          placeholder="VD: Nguyễn Văn A"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
        />

        <Input
          label="Số điện thoại *"
          placeholder="VD: 0912345678"
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          error={errors.phone}
        />

        <Input
          label="Email"
          placeholder="VD: customer@gmail.com"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
        />

        <Select
          label="Hạng thành viên"
          value={tier}
          onChange={setTier}
          options={tierOptions}
        />

        <Textarea
          label="Ghi chú thêm"
          placeholder="Ghi chú sở thích, lưu ý y tế hoặc tình trạng da..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Đang thêm...
              </span>
            ) : (
              "Xác nhận thêm"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
