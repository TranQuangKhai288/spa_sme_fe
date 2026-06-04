"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSpaData } from "@/hooks/useSpaData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { CreateAppointmentModal } from "@/components/dashboard/CreateAppointmentModal";
import { EditClientModal } from "@/components/dashboard/EditClientModal";
import {
  ArrowLeft,
  CalendarPlus,
  Pencil,
  Trash2,
  Star,
  Clock,
  Calendar,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  AlertCircle
} from "lucide-react";
import { formatDateString, formatVnd, tierBadgeClass } from "@/lib/utils";

export function CustomerDetailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const {
    clients,
    appointments,
    treatmentProgress,
    updateClient,
    deleteClient,
  } = useSpaData();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/customers")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
        <GlassCard className="p-8 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-dark-slate mb-2">Không tìm thấy Khách hàng</h2>
          <p className="text-on-surface-variant">Khách hàng này có thể đã bị xóa hoặc không tồn tại.</p>
        </GlassCard>
      </div>
    );
  }

  // Filter related data
  const clientAppointments = appointments.filter(
    (a) => a.clientId === client.id || a.clientName === client.name
  );

  const clientProgresses = treatmentProgress.filter(
    (tp) => tp.clientId === client.id || tp.clientName === client.name
  );

  const handleDelete = async () => {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng ${client.name}?`)) {
      try {
        if (deleteClient) {
          await deleteClient(client.id);
          showToast(`Đã xóa khách hàng ${client.name}`, "info");
          router.push("/dashboard/customers");
        }
      } catch (err) {
        showToast("Lỗi xóa khách hàng. Vui lòng thử lại!", "error");
      }
    }
  };

  const handleToggleVip = async () => {
    const nextTierMap: Record<string, string> = {
      "Bạc": "Vàng",
      "Vàng": "Bạch Kim",
      "Bạch Kim": "Kim Cương",
      "Kim Cương": "Bạc"
    };
    const nextTier = nextTierMap[client.tier] || "Kim Cương";
    try {
      if (updateClient) {
        await updateClient(client.id, { tier: nextTier });
        showToast(`Đã nâng hạng VIP cho ${client.name} thành ${nextTier}!`, "success");
      }
    } catch {
      showToast("Cập nhật hạng VIP thất bại.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Top Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/customers")}
            className="rounded-xl border border-glass-border bg-white/40 text-dark-slate"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline ml-1">Danh sách khách hàng</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            onClick={() => showToast(`Gửi tin nhắn SMS thành công tới ${client.name}!`, "success")}
            className="rounded-xl border border-glass-border bg-white/40 text-dark-slate"
            icon={<MessageSquare size={16} />}
          >
            Gửi SMS
          </Button>
          <Button
            variant="ghost"
            onClick={handleToggleVip}
            className="rounded-xl border border-glass-border hover:bg-white/50 text-dark-slate"
            icon={<Star size={16} className="text-soft-gold" />}
          >
            Nâng hạng VIP
          </Button>
          <Button
            variant="ghost"
            onClick={() => setEditOpen(true)}
            className="rounded-xl border border-glass-border hover:bg-white/50 text-dark-slate"
            icon={<Pencil size={16} />}
          >
            Sửa thông tin
          </Button>
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="rounded-xl border-red-200 hover:bg-red-50 text-red-500 hover:border-red-300"
            icon={<Trash2 size={16} />}
          >
            Xóa khách
          </Button>
          <Button
            onClick={() => setBookingOpen(true)}
            className="rounded-xl font-bold shadow-lg shadow-primary/10"
            icon={<CalendarPlus size={16} />}
          >
            Tạo lịch hẹn
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Client Profile Info */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 rounded-3xl border border-white/40 flex flex-col items-center text-center">
            <img
              src={client.avatar || "https://i.pravatar.cc/150"}
              alt={client.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mb-3"
            />
            <h2 className="font-headline text-xl font-bold text-dark-slate mb-1">
              {client.name}
            </h2>
            
            <span
              className={`whitespace-nowrap rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-4 ${tierBadgeClass(
                client.tier
              )}`}
            >
              {client.tier}
            </span>

            {/* Client Quick Stats */}
            <div className="w-full grid grid-cols-3 gap-2 border-t border-b border-glass-border py-4 my-2 text-center">
              <div>
                <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase block mb-0.5">
                  Lượt Visit
                </span>
                <span className="font-bold text-jade-green text-base">
                  {client.totalVisits}
                </span>
              </div>
              <div className="border-l border-r border-glass-border">
                <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase block mb-0.5">
                  Chi tiêu
                </span>
                <span className="font-bold text-dark-slate text-sm">
                  {formatVnd(client.totalSpent)}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase block mb-0.5">
                  Điểm thưởng
                </span>
                <span className="font-bold text-soft-gold text-sm flex items-center justify-center gap-0.5">
                  <Star size={12} fill="currentColor" />
                  {client.memberPoints}
                </span>
              </div>
            </div>

            {/* Profile Info Fields */}
            <div className="w-full text-left space-y-3 mt-4 text-xs font-medium text-dark-slate">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-on-surface-variant/60 shrink-0" />
                <span>{client.phone}</span>
              </div>
              {client.email && (
                <div className="flex items-center gap-3 min-w-0">
                  <Mail size={14} className="text-on-surface-variant/60 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-on-surface-variant/60 shrink-0" />
                <span>Tham gia: {formatDateString(client.joinDate)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-on-surface-variant/60 shrink-0" />
                <span>Lần cuối: {formatDateString(client.lastVisit)}</span>
              </div>

              {client.notes && (
                <div className="pt-3 border-t border-glass-border mt-3 text-left">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80 mb-1">
                    Ghi chú của tư vấn viên
                  </h4>
                  <p className="text-xs text-on-surface-variant italic leading-relaxed bg-white/20 p-2.5 rounded-xl border border-glass-border">
                    "{client.notes}"
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Treatment Progress and Appointments History */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Treatment packages */}
          <GlassCard className="p-6 rounded-3xl border border-white/40">
            <h3 className="font-headline text-base font-bold text-dark-slate mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-primary animate-pulse" />
              Gói liệu trình đang thực hiện ({clientProgresses.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientProgresses.length === 0 ? (
                <div className="col-span-2 text-center text-xs italic text-on-surface-variant/60 py-6">
                  Khách hàng này hiện chưa đăng ký gói liệu trình nào.
                </div>
              ) : (
                clientProgresses.map((tp) => {
                  const percentage = Math.round((tp.completedSessions / tp.totalSessions) * 100);
                  return (
                    <div
                      key={tp.id}
                      className="p-4 rounded-2xl border border-glass-border bg-white/20 hover:bg-white/40 transition-all flex items-center gap-4"
                    >
                      <div className="relative w-14 h-14 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle className="stroke-black/5" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                          <circle
                            className="stroke-jade-green"
                            cx="18"
                            cy="18"
                            fill="none"
                            r="16"
                            strokeDasharray={`${percentage}, 100`}
                            strokeLinecap="round"
                            strokeWidth="3"
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[10px] font-extrabold text-dark-slate">
                            {tp.completedSessions}/{tp.totalSessions}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-dark-slate text-xs mb-0.5">{tp.packageName}</h4>
                        <div className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-1 font-semibold">
                          <Calendar size={12} className="text-jade-green" />
                          <span>Hẹn tiếp: {formatDateString(tp.nextDate)} lúc {tp.nextTime}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>

          {/* Section 2: Appointments History */}
          <GlassCard className="p-6 rounded-3xl border border-white/40">
            <h3 className="font-headline text-base font-bold text-dark-slate mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Lịch sử đặt lịch hẹn ({clientAppointments.length})
            </h3>
            <div className="space-y-3">
              {clientAppointments.length === 0 ? (
                <div className="text-center text-xs italic text-on-surface-variant/60 py-6">
                  Chưa có lịch sử đặt lịch hẹn.
                </div>
              ) : (
                clientAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl border border-glass-border bg-white/20 hover:bg-white/45 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-dark-slate text-xs">
                        {apt.service || "Chưa chọn dịch vụ"}
                      </h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        KTV: {apt.therapist}
                      </p>
                      <div className="flex items-center gap-3 text-[9px] text-on-surface-variant/80 mt-1 font-medium">
                        <span className="flex items-center gap-0.5">
                          <Calendar size={11} />
                          {formatDateString(apt.date)}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock size={11} />
                          {apt.startTime} - {apt.endTime}
                        </span>
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

      {bookingOpen && (
        <CreateAppointmentModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          defaultClientId={client.id}
        />
      )}

      {editOpen && (
        <EditClientModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          client={client}
        />
      )}
    </div>
  );
}
