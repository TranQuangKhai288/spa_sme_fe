"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSpaData } from "@/hooks/useSpaData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import {
  ArrowLeft,
  Award,
  Star,
  Sparkles,
  Clock,
  Calendar,
  CheckCircle,
  Pencil,
  Trash2,
  AlertCircle
} from "lucide-react";
import { formatDateString, formatVnd } from "@/lib/utils";

export function TherapistDetailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const {
    therapists,
    appointments,
    currentUser,
    deleteTherapist,
  } = useSpaData();

  const therapist = therapists.find((t) => t.id === id);

  if (!therapist) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/therapists")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
        <GlassCard className="p-8 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-dark-slate mb-2">Không tìm thấy Nhân viên</h2>
          <p className="text-on-surface-variant">Nhân viên này có thể đã bị xóa hoặc không tồn tại.</p>
        </GlassCard>
      </div>
    );
  }

  // Filter appointments for this therapist
  const therapistAppointments = appointments.filter(
    (a) => (a.therapistId === therapist.id || a.therapist === therapist.name)
  );

  const handleDelete = async () => {
    if (confirm(`Bạn có chắc chắn muốn xóa nhân viên ${therapist.name}?`)) {
      try {
        await deleteTherapist(therapist.id);
        showToast(`Đã xóa nhân viên ${therapist.name}`, "info");
        router.push("/dashboard/therapists");
      } catch (err) {
        showToast("Lỗi xóa nhân viên. Vui lòng thử lại!", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/therapists")}
            className="rounded-xl border border-glass-border bg-white/40 text-dark-slate"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline ml-1">Danh sách nhân viên</span>
          </Button>
        </div>
        
        {currentUser.role === "admin" && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                showToast("Tính năng sửa trực tiếp từ chi tiết sẽ sớm được hoàn thiện. Bạn có thể sửa từ danh sách chính.", "info");
              }}
              className="rounded-xl border border-glass-border hover:bg-white/50 text-dark-slate"
            >
              <Pencil size={16} /> Sửa hồ sơ
            </Button>
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="rounded-xl border-red-200 hover:bg-red-50 text-red-500 hover:border-red-300"
            >
              <Trash2 size={16} /> Xóa nhân viên
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Therapist Profile Info */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <GlassCard className="p-6 rounded-3xl border border-white/40 flex flex-col items-center text-center">
            <img
              src={therapist.avatar || "https://i.pravatar.cc/150"}
              alt={therapist.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mb-4"
            />
            <h2 className="font-headline text-2xl font-bold text-dark-slate mb-1">
              {therapist.name}
            </h2>
            <p className="text-sm font-semibold text-primary mb-3">
              {therapist.specialty}
            </p>
            
            <span
              className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-4 ${
                therapist.availability === "available"
                  ? "bg-jade-green/10 text-jade-green border border-jade-green/20"
                  : therapist.availability === "busy"
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}
            >
              {therapist.availability === "available"
                ? "Sẵn sàng"
                : therapist.availability === "busy"
                  ? "Đang bận"
                  : "Vắng mặt"}
            </span>

            <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-glass-border py-4 my-2">
              <div className="text-center">
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase block mb-1">
                  Kinh nghiệm
                </span>
                <span className="font-bold text-dark-slate flex items-center justify-center gap-1 text-sm">
                  <Award size={16} className="text-soft-gold" />
                  {therapist.experience}
                </span>
              </div>
              <div className="text-center border-l border-glass-border">
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase block mb-1">
                  Đánh giá
                </span>
                <span className="font-bold text-dark-slate flex items-center justify-center gap-1 text-sm">
                  <Star size={16} fill="#D4AF37" className="text-soft-gold" />
                  {therapist.rating.toFixed(1)} ({therapist.totalReviews})
                </span>
              </div>
            </div>

            {therapist.bio && (
              <div className="w-full text-left mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Tiểu sử / Bio
                </h4>
                <p className="text-xs text-on-surface-variant/80 italic leading-relaxed bg-white/20 p-3 rounded-xl border border-glass-border">
                  "{therapist.bio}"
                </p>
              </div>
            )}
          </GlassCard>

          {/* Specialty Services List */}
          <GlassCard className="p-6 rounded-3xl border border-white/40">
            <h3 className="font-headline text-base font-bold text-dark-slate mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              Dịch vụ phụ trách ({therapist.services?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {therapist.services && therapist.services.length > 0 ? (
                therapist.services.map((svc) => (
                  <span
                    key={svc}
                    className="text-xs font-semibold bg-primary/5 text-primary border border-primary/10 rounded-xl px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <CheckCircle size={12} className="text-primary/70" />
                    {svc}
                  </span>
                ))
              ) : (
                <span className="text-xs text-on-surface-variant/50 italic">
                  Chưa phân bổ dịch vụ
                </span>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Appointments Schedule */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <GlassCard className="p-6 rounded-3xl border border-white/40">
            <h3 className="font-headline text-lg font-bold text-dark-slate mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Lịch trình trị liệu ({therapistAppointments.length})
            </h3>

            <div className="space-y-4">
              {therapistAppointments.length === 0 ? (
                <div className="p-12 text-center text-sm text-on-surface-variant/70 italic">
                  Chưa có lịch hẹn nào được phân công cho nhân viên này.
                </div>
              ) : (
                therapistAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl border border-glass-border bg-white/20 hover:bg-white/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={apt.clientAvatar || "https://i.pravatar.cc/150"}
                        alt={apt.clientName}
                        className="w-12 h-12 rounded-full object-cover border border-glass-border"
                      />
                      <div>
                        <h4 className="font-bold text-dark-slate text-sm">
                          {apt.clientName}
                        </h4>
                        <p className="text-xs font-semibold text-primary mt-0.5">
                          {apt.service || "Chưa chọn dịch vụ"}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-on-surface-variant/80 mt-1 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDateString(apt.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {apt.startTime} - {apt.endTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-glass-border">
                      <span className="text-xs font-bold text-dark-slate">
                        {formatVnd(apt.price)}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          apt.status === "completed"
                            ? "bg-jade-green/10 text-jade-green border border-jade-green/20"
                            : apt.status === "cancelled"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : "bg-primary/10 text-primary border border-primary/20"
                        }`}
                      >
                        {apt.status === "confirmed" ? "Sắp tới" : apt.statusLabel}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
