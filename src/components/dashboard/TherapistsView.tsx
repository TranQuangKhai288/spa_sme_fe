"use client";

import { useState } from "react";
import Link from "next/link";
import { useSpaData } from "@/hooks/useSpaData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { showToast } from "@/components/ui/Toast";
import {
  Plus,
  Trash2,
  Pencil,
  Star,
  Award,
  Clock,
  Sparkles,
  X,
  UserCheck,
  Loader2
} from "lucide-react";

export function TherapistsView() {
  const { therapists, services, addTherapist, updateTherapist, deleteTherapist, currentUser } = useSpaData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [availability, setAvailability] = useState("available");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingTherapist(null);
    setName("");
    setAvatar("");
    setSpecialty("Chuyên gia chăm sóc da");
    setExperience("5 năm");
    setBio("");
    setSelectedServices([]);
    setAvailability("available");
    setModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditingTherapist(t.id);
    setName(t.name);
    setAvatar(t.avatar);
    setSpecialty(t.specialty);
    setExperience(t.experience);
    setBio(t.bio);
    setSelectedServices(t.services || []);
    setAvailability(t.availability || "available");
    setModalOpen(true);
  };

  const handleServiceToggle = (svcName: string) => {
    setSelectedServices((prev) =>
      prev.includes(svcName)
        ? prev.filter((s) => s !== svcName)
        : [...prev, svcName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty) {
      showToast("Vui lòng điền tên và chuyên môn!", "warning");
      return;
    }

    const payload = {
      name,
      avatar: avatar || undefined,
      specialty,
      experience,
      bio,
      services: selectedServices,
      availability,
    };

    setIsLoading(true);
    try {
      if (editingTherapist) {
        await updateTherapist(editingTherapist, payload);
        showToast("Cập nhật KTV thành công!", "success");
      } else {
        await addTherapist(payload as any);
        showToast("Thêm KTV mới thành công!", "success");
      }
      setModalOpen(false);
    } catch (err) {
      showToast("Lỗi xử lý KTV. Vui lòng thử lại!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, tname: string) => {
    if (confirm(`Bạn có chắc muốn xóa Nhân viên ${tname}?`)) {
      setDeletingId(id);
      try {
        await deleteTherapist(id);
        showToast(`Đã xóa KTV ${tname}`, "info");
      } catch (err) {
        showToast("Lỗi xóa KTV. Vui lòng thử lại!", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const availabilityOptions = [
    { value: "available", label: "Sẵn sàng (Available)" },
    { value: "busy", label: "Đang bận (Busy)" },
    { value: "off", label: "Nghỉ phép (Off)" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-dark-slate sm:text-3xl">
            Quản lý Nhân viên (KTV)
          </h1>
          <p className="text-sm text-on-surface-variant/80">
            Xem hồ sơ, quản lý trạng thái và danh sách dịch vụ của Nhân viên
          </p>
        </div>
        {currentUser.role === "admin" && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Thêm Nhân viên mới
          </button>
        )}
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapists.map((t) => (
          <GlassCard key={t.id} className="p-6 rounded-2xl flex flex-col justify-between" hover>
            <div>
              {/* Profile Header */}
              <Link href={`/dashboard/therapists/detail?id=${t.id}`} className="flex items-start gap-4 mb-4 group/profile cursor-pointer block">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-glass-border shadow-sm shrink-0 group-hover/profile:border-primary transition-all"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-headline text-base font-bold text-dark-slate truncate group-hover/profile:text-primary transition-colors">
                      {t.name}
                    </h3>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${t.availability === "available"
                          ? "bg-jade-green/10 text-jade-green border border-jade-green/20"
                          : t.availability === "busy"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                        }`}
                    >
                      {t.availability === "available"
                        ? "Sẵn sàng"
                        : t.availability === "busy"
                          ? "Đang bận"
                          : "Vắng mặt"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary truncate">
                    {t.specialty}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-on-surface-variant/70">
                    <span className="flex items-center gap-1">
                      <Award size={13} className="text-soft-gold" />
                      {t.experience}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Star size={13} fill="#D4AF37" className="text-soft-gold" />
                      <span className="font-bold text-dark-slate">{t.rating.toFixed(1)}</span>
                      <span>({t.totalReviews})</span>
                    </span>
                  </div>
                </div>
              </Link>

              {/* Bio description */}
              {t.bio && (
                <p className="text-xs text-on-surface-variant/80 italic leading-relaxed mb-4 bg-white/20 p-3 rounded-xl border border-glass-border">
                  "{t.bio}"
                </p>
              )}

              {/* Specialty Services List */}
              <div className="mb-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Dịch vụ đảm nhận
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {t.services && t.services.length > 0 ? (
                    t.services.map((svc) => (
                      <span
                        key={svc}
                        className="text-[10px] font-medium bg-primary/5 text-primary border border-primary/10 rounded-lg px-2 py-1 flex items-center gap-1"
                      >
                        <Sparkles size={10} />
                        {svc}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-on-surface-variant/50 italic">
                      Chưa phân bổ dịch vụ
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            {currentUser.role === "admin" && (
              <div className="flex gap-2 pt-3 border-t border-glass-border">
                <button
                  onClick={() => openEditModal(t)}
                  className="flex-1 text-xs font-bold border border-glass-border text-dark-slate hover:bg-white/40 rounded-xl py-2 flex items-center justify-center gap-1 transition-all"
                >
                  <Pencil size={14} />
                  Sửa hồ sơ
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  disabled={deletingId === t.id}
                  className="text-on-surface-variant hover:text-red-500 border border-glass-border hover:border-red-500/20 px-3 py-2 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {deletingId === t.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Form Modal (Add / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-end justify-center bg-dark-slate/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="glass-card max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/50 p-6 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-glass-border pb-4">
              <h3 className="font-headline text-xl font-bold text-dark-slate">
                {editingTherapist ? "Cập nhật thông tin KTV" : "Thêm Nhân viên mới"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-2 hover:bg-white/50 flex items-center justify-center text-on-surface-variant/80 hover:text-on-surface"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Họ và tên KTV"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Thị Lan"
                  required
                />
                <Input
                  label="Link ảnh Đại diện (Avatar URL)"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://i.pravatar.cc/150?img=..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Chuyên môn"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Chuyên gia massage trị liệu"
                  required
                />
                <Input
                  label="Kinh nghiệm"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="5 năm"
                />
                <Select
                  label="Trạng thái làm việc"
                  value={availability}
                  onChange={setAvailability}
                  options={availabilityOptions}
                />
              </div>

              <Textarea
                label="Mô tả / Tiểu sử KTV"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Giới thiệu bản thân, kỹ năng tay nghề của Nhân viên..."
                rows={3}
              />

              {/* Service Selection Checkboxes */}
              <div>
                <span className="font-cta mb-2 block text-on-surface-variant font-medium text-sm">
                  Dịch vụ phụ trách (Click để chọn)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto border border-glass-border p-3 rounded-xl bg-white/20">
                  {services.map((svc) => {
                    const isChecked = selectedServices.includes(svc.name);
                    return (
                      <label
                        key={svc.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-all text-xs font-medium ${isChecked
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-white/40 border-glass-border text-dark-slate hover:bg-white/70"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleServiceToggle(svc.name)}
                          className="sr-only"
                        />
                        <Sparkles size={14} className={isChecked ? "text-primary animate-pulse" : "text-on-surface-variant/40"} />
                        <span>{svc.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-glass-border">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} disabled={isLoading}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    editingTherapist ? "Lưu thay đổi" : "Thêm mới KTV"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
