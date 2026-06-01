"use client";

import { useEffect, useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import {
  X,
  TrendingUp,
  Star,
  Sparkles,
  AlertCircle,
  Calendar,
  User,
  Clock,
  Check,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  FileText,
  DollarSign,
  Briefcase,
  Smile,
  BadgeAlert,
  Smartphone,
  Info
} from "lucide-react";
import { statusBadgeClass, tierBadgeClass } from "@/lib/utils";
import { localizedStatus } from "@/hooks/useLocalizedStatus";
import { showToast } from "@/components/ui/Toast";

interface StatDrawerProps {
  open: boolean;
  onClose: () => void;
  type: "bookings" | "vips" | "revenue" | "reminders" | null;
  dateStr: string;
}

export function StatDrawer({ open, onClose, type, dateStr }: StatDrawerProps) {
  const { appointments, updateAppointmentStatus, deleteAppointment } = useSpaData();

  if (!open || !type) return null;

  // Filter appointments for the selected date
  const dayAppointments = appointments.filter((apt) => apt.date === dateStr);
  const activeAppointments = dayAppointments.filter((apt) => apt.status !== "cancelled");

  // Format Date label
  const formatDateLabel = (ymdStr: string) => {
    const parts = ymdStr.split("-");
    if (parts.length !== 3) return ymdStr;
    return `Ngày ${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const formattedDate = formatDateLabel(dateStr);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end items-end md:items-stretch bg-dark-slate/40 backdrop-blur-sm animate-fadeInBackdrop">
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10 cursor-default" onClick={onClose} />

      {/* Drawer Panel Container */}
      <div
        className="drawer-panel glass-card flex flex-col w-full md:w-1/2 md:max-w-lg h-[85dvh] md:h-full rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-t md:border-t-0 md:border-l border-white/50 shadow-2xl p-0 overflow-hidden bg-white/30 backdrop-blur-3xl"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-glass-border flex items-center justify-between shrink-0 bg-white/40">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-primary/70 uppercase block mb-1">
              {formattedDate}
            </span>
            <h3 className="font-headline text-lg font-bold text-dark-slate flex items-center gap-2">
              {type === "bookings" && (
                <>
                  <Briefcase size={18} className="text-jade-green" />
                  Chi tiết Lịch đặt
                </>
              )}
              {type === "vips" && (
                <>
                  <Star size={18} className="text-soft-gold" fill="currentColor" />
                  Khách VIP Hôm nay
                </>
              )}
              {type === "revenue" && (
                <>
                  <DollarSign size={18} className="text-jade-green" />
                  Phân tích Doanh thu
                </>
              )}
              {type === "reminders" && (
                <>
                  <AlertCircle size={18} className="text-red-500" />
                  Công việc Cần xử lý
                </>
              )}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/50 flex items-center justify-center text-on-surface-variant/80 hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 scrollbar-hide">
          {type === "bookings" && (
            <BookingsDetail
              appointments={dayAppointments}
              onUpdateStatus={updateAppointmentStatus}
              onDelete={deleteAppointment}
            />
          )}
          {type === "vips" && <VipsDetail appointments={activeAppointments} />}
          {type === "revenue" && <RevenueDetail appointments={dayAppointments} />}
          {type === "reminders" && (
            <RemindersDetail
              appointments={dayAppointments}
              onUpdateStatus={updateAppointmentStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   1. BOOKINGS DETAIL COMPONENT
   ========================================== */
function BookingsDetail({
  appointments,
  onUpdateStatus,
  onDelete,
}: {
  appointments: any[];
  onUpdateStatus: any;
  onDelete: any;
}) {
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const inProgressCount = appointments.filter((a) => a.status === "in_progress").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;
  const total = appointments.length;

  // Calculate most booked services
  const serviceStats: Record<string, number> = {};
  appointments.forEach((apt) => {
    if (apt.status !== "cancelled" && apt.service) {
      serviceStats[apt.service] = (serviceStats[apt.service] || 0) + 1;
    }
  });
  const topServices = Object.entries(serviceStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Overview Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/60 p-4 rounded-xl border border-glass-border text-center">
          <p className="text-xs text-on-surface-variant/80 font-medium">Tổng lịch đặt</p>
          <p className="text-2xl font-bold text-dark-slate mt-1">{total}</p>
        </div>
        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-center">
          <p className="text-xs text-primary/80 font-medium">Đang & hoàn tất</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {inProgressCount + completedCount}
          </p>
        </div>
      </div>

      {/* Status Breakdown Progress Bars */}
      <div className="bg-white p-4 rounded-xl border border-glass-border space-y-3">
        <h4 className="text-xs font-bold text-dark-slate uppercase tracking-wider">
          Phân loại trạng thái
        </h4>
        <div className="space-y-2">
          {/* Confirmed */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-on-surface-variant font-medium">Đã xác nhận</span>
              <span className="font-bold text-dark-slate">{confirmedCount}</span>
            </div>
            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: total ? `${(confirmedCount / total) * 100}%` : "0%" }}
              />
            </div>
          </div>
          {/* In Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-on-surface-variant font-medium">Đang xử lý</span>
              <span className="font-bold text-dark-slate">{inProgressCount}</span>
            </div>
            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: total ? `${(inProgressCount / total) * 100}%` : "0%" }}
              />
            </div>
          </div>
          {/* Completed */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-on-surface-variant font-medium">Đã hoàn tất</span>
              <span className="font-bold text-dark-slate">{completedCount}</span>
            </div>
            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-jade-green rounded-full"
                style={{ width: total ? `${(completedCount / total) * 100}%` : "0%" }}
              />
            </div>
          </div>
          {/* Cancelled */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-on-surface-variant font-medium">Đã hủy</span>
              <span className="font-bold text-dark-slate">{cancelledCount}</span>
            </div>
            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: total ? `${(cancelledCount / total) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Services Breakdown */}
      {topServices.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-glass-border space-y-3">
          <h4 className="text-xs font-bold text-dark-slate uppercase tracking-wider">
            Dịch vụ được chuộng nhất
          </h4>
          <div className="space-y-2">
            {topServices.map(([serviceName, count]) => (
              <div key={serviceName} className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant font-medium truncate max-w-xs">
                  {serviceName}
                </span>
                <span className="font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full shrink-0">
                  {count} lượt
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline List of Bookings */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-dark-slate uppercase tracking-wider">
          Danh sách cuộc hẹn
        </h4>
        {appointments.length === 0 ? (
          <p className="text-xs text-on-surface-variant/80 italic text-center py-4">
            Không có cuộc hẹn nào trong ngày này.
          </p>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className={`bg-white p-4 rounded-xl border border-glass-border space-y-3 transition-opacity ${
                  apt.status === "cancelled" ? "opacity-60" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <img
                      src={apt.clientAvatar}
                      alt={apt.clientName}
                      className="w-10 h-10 rounded-full object-cover border border-primary/20 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-dark-slate text-xs">{apt.clientName}</span>
                        <span className={`text-[8px] px-1.5 py-0.2 rounded-full ${tierBadgeClass(apt.clientTier)}`}>
                          {apt.clientTier}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {apt.startTime} - {apt.endTime}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${statusBadgeClass(apt.status)}`}>
                    {localizedStatus(apt.status)}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-on-surface-variant border-t border-glass-border/30 pt-2.5">
                  <p className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-primary" />
                    <span className="font-semibold text-dark-slate">{apt.service || "Chưa chọn"}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <User size={12} />
                    <span>KTV: <span className="font-medium text-dark-slate">{apt.therapist}</span></span>
                  </p>
                  {apt.notes && (
                    <p className="text-[10px] italic text-on-surface-variant/80 pl-4 border-l border-glass-border">
                      Ghi chú: {apt.notes}
                    </p>
                  )}
                </div>

                {/* Quick actions inside drawer */}
                {apt.status !== "completed" && apt.status !== "cancelled" && (
                  <div className="flex justify-end gap-2 pt-1">
                    {apt.status === "confirmed" && (
                      <button
                        onClick={async () => {
                          try {
                            await onUpdateStatus(apt.id, "in_progress");
                            showToast(`Check-in thành công: ${apt.clientName}`, "success");
                          } catch {
                            showToast("Check-in thất bại. Vui lòng thử lại!", "error");
                          }
                        }}
                        className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-md active:scale-95 transition-all cursor-pointer"
                      >
                        Điểm danh
                      </button>
                    )}
                    {apt.status === "in_progress" && (
                      <button
                        onClick={async () => {
                          try {
                            await onUpdateStatus(apt.id, "completed");
                            showToast(`Hoàn tất liệu trình: ${apt.clientName}`, "success");
                          } catch {
                            showToast("Không thể cập nhật. Vui lòng thử lại!", "error");
                          }
                        }}
                        className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-md active:scale-95 transition-all cursor-pointer"
                      >
                        Hoàn tất
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        try {
                          await onUpdateStatus(apt.id, "cancelled");
                          showToast(`Đã hủy lịch: ${apt.clientName}`, "warning");
                        } catch {
                          showToast("Hủy lịch thất bại. Vui lòng thử lại!", "error");
                        }
                      }}
                      className="border border-red-500/20 text-red-500 hover:bg-red-500/10 text-[10px] font-semibold px-3 py-1 rounded-md transition-all cursor-pointer"
                    >
                      Hủy lịch
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   2. VIP GUESTS DETAIL COMPONENT
   ========================================== */
function VipsDetail({ appointments }: { appointments: any[] }) {
  const vipAppointments = appointments.filter(
    (apt) => apt.clientTier === "Kim Cương" || apt.clientTier === "Bạch Kim"
  );

  // Hardcode some premium mock instructions/preference data based on index
  const getMockVipPreferences = (index: number) => {
    const preferencesList = [
      [
        "Yêu cầu phòng VIP riêng tư 1, yên tĩnh tối đa.",
        "Sử dụng tinh dầu Oải Hương nhẹ dịu.",
        "Phục vụ trà hoa cúc nóng sau khi hoàn tất liệu trình."
      ],
      [
        "Khách có làn da khô nhạy cảm, hạn chế tẩy tế bào chết mạnh.",
        "Chỉ định Kỹ thuật viên cao cấp chăm sóc riêng.",
        "Phục vụ nước ép cam ít đường sau khi xong dịch vụ."
      ],
      [
        "Yêu cầu kỹ thuật viên tay nghề chuyên môn cao.",
        "Tránh các sản phẩm chăm sóc có cồn hoặc paraben.",
        "Nước ấm ngâm chân cần duy trì ở nhiệt độ 40°C."
      ]
    ];
    return preferencesList[index % preferencesList.length];
  };

  return (
    <div className="space-y-6">
      <div className="bg-soft-gold/10 p-4 rounded-xl border border-soft-gold/20 flex items-center gap-3">
        <Star className="text-soft-gold shrink-0" fill="currentColor" size={24} />
        <div>
          <h4 className="text-xs font-bold text-soft-gold uppercase tracking-wider">
            Quy trình chăm sóc VIP
          </h4>
          <p className="text-[11px] text-dark-slate/80 leading-relaxed mt-0.5">
            Ưu tiên chuẩn bị trà, hoa quả và phòng VIP trước giờ hẹn 15 phút. Điều phối KTV tay nghề tốt nhất trực tiếp phục vụ.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-dark-slate uppercase tracking-wider">
          Danh sách khách hàng VIP ({vipAppointments.length})
        </h4>

        {vipAppointments.length === 0 ? (
          <p className="text-xs text-on-surface-variant/80 italic text-center py-4">
            Không có khách hàng VIP nào đặt lịch trong ngày này.
          </p>
        ) : (
          vipAppointments.map((apt, index) => {
            const preferences = getMockVipPreferences(index);
            return (
              <div
                key={apt.id}
                className="bg-white p-5 rounded-xl border border-soft-gold/30 shadow-xs relative overflow-hidden space-y-4"
              >
                {/* Background decorative shine */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-soft-gold/5 rounded-full blur-xl pointer-events-none" />

                {/* Profile row */}
                <div className="flex gap-4 items-center relative">
                  <img
                    src={apt.clientAvatar}
                    alt={apt.clientName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-soft-gold"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-dark-slate text-sm">{apt.clientName}</span>
                      <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${tierBadgeClass(apt.clientTier)}`}>
                        {apt.clientTier}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant/80 flex items-center gap-1 mt-0.5">
                      <Clock size={11} />
                      {apt.startTime} - {apt.endTime} ({apt.therapist})
                    </p>
                  </div>
                </div>

                {/* Service box */}
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 text-xs">
                  <p className="font-medium text-dark-slate flex items-center gap-1.5">
                    <Sparkles size={12} className="text-primary" />
                    Dịch vụ: {apt.service || "Chưa chọn"}
                  </p>
                  {apt.notes && (
                    <p className="text-[10px] text-on-surface-variant mt-1.5 italic">
                      Yêu cầu thêm: "{apt.notes}"
                    </p>
                  )}
                </div>

                {/* Special Preferences List */}
                <div className="space-y-2 border-t border-glass-border/30 pt-3">
                  <span className="text-[10px] font-bold text-soft-gold uppercase tracking-wider block">
                    Lưu ý đặc biệt cho KTV:
                  </span>
                  <ul className="space-y-1.5">
                    {preferences.map((pref, i) => (
                      <li key={i} className="text-[11px] text-on-surface-variant flex items-start gap-1.5">
                        <Check className="text-jade-green shrink-0 mt-0.5" size={12} />
                        <span>{pref}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ==========================================
   3. REVENUE DETAIL COMPONENT
   ========================================== */
function RevenueDetail({ appointments }: { appointments: any[] }) {
  // Sum estimates
  const completedRevenue = appointments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + Number(a.price || 0), 0);

  const pendingRevenue = appointments
    .filter((a) => a.status === "confirmed" || a.status === "in_progress")
    .reduce((sum, a) => sum + Number(a.price || 0), 0);

  const cancelledRevenue = appointments
    .filter((a) => a.status === "cancelled")
    .reduce((sum, a) => sum + Number(a.price || 0), 0);

  const totalEstimated = completedRevenue + pendingRevenue;

  const targetVND = 25000000; // 25M
  const progressPercent = Math.min(100, Math.round((totalEstimated / targetVND) * 100));

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  const activeApptsCount = appointments.filter((a) => a.status !== "cancelled").length;
  const aov = activeApptsCount ? Math.round(totalEstimated / activeApptsCount) : 0;

  return (
    <div className="space-y-6">
      {/* Target Progress Bar Card */}
      <div className="bg-white p-5 rounded-xl border border-glass-border space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xs font-bold text-dark-slate uppercase tracking-wider">
              Mục tiêu Doanh số Ngày
            </h4>
            <p className="text-[10px] text-on-surface-variant/80 mt-0.5">
              Chỉ tiêu: <span className="font-semibold">{formatVnd(targetVND)}</span> (25M)
            </p>
          </div>
          <span className="text-lg font-extrabold text-primary">{progressPercent}%</span>
        </div>
        <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-jade-green to-soft-gold rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-on-surface-variant/80 italic text-center">
          {progressPercent >= 100
            ? "🎉 Chúc mừng! Đã đạt và vượt chỉ tiêu doanh số hôm nay!"
            : `Còn thiếu ${formatVnd(Math.max(0, targetVND - totalEstimated))} để đạt mục tiêu.`}
        </p>
      </div>

      {/* Financial Blocks */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-dark-slate uppercase tracking-wider">
          Phân tích doanh số
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-jade-green/5 p-4 rounded-xl border border-jade-green/10 space-y-1">
            <span className="text-on-surface-variant font-medium">Doanh thu Đã Thu</span>
            <p className="text-sm font-bold text-jade-green">{formatVnd(completedRevenue)}</p>
          </div>
          <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 space-y-1">
            <span className="text-on-surface-variant font-medium">Doanh thu Dự kiến</span>
            <p className="text-sm font-bold text-blue-500">{formatVnd(pendingRevenue)}</p>
          </div>
          <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 space-y-1 col-span-2">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-medium">Thất thoát (Hủy lịch)</span>
              <p className="font-bold text-red-500">{formatVnd(cancelledRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced metrics */}
      <div className="bg-white p-4 rounded-xl border border-glass-border text-xs space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant font-medium">Giá trị đơn trung bình (AOV)</span>
          <span className="font-bold text-dark-slate">{formatVnd(aov)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant font-medium">Số lượng lịch active</span>
          <span className="font-bold text-dark-slate">{activeApptsCount} lịch</span>
        </div>
      </div>

      {/* Booking Payments List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-dark-slate uppercase tracking-wider">
          Chi tiết thanh toán từ lịch hẹn
        </h4>
        {appointments.length === 0 ? (
          <p className="text-xs text-on-surface-variant/80 italic text-center py-4">
            Không có dữ liệu thanh toán.
          </p>
        ) : (
          <div className="space-y-2.5">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-3 rounded-lg border border-glass-border flex justify-between items-center text-xs"
              >
                <div className="truncate max-w-[280px]">
                  <p className="font-bold text-dark-slate truncate">{apt.clientName}</p>
                  <p className="text-[10px] text-on-surface-variant/80 truncate mt-0.5">
                    {apt.service || "Chưa chọn dịch vụ"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-dark-slate">{formatVnd(apt.price || 0)}</p>
                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider block mt-1 ${statusBadgeClass(apt.status)}`}>
                    {apt.status === "completed" ? "Đã thu" : apt.status === "cancelled" ? "Đã hủy" : "Chờ thu"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   4. REMINDERS DETAIL COMPONENT
   ========================================== */
function RemindersDetail({
  appointments,
  onUpdateStatus,
}: {
  appointments: any[];
  onUpdateStatus: any;
}) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Items filtering
  const toCheckIn = appointments.filter((a) => a.status === "confirmed");
  const vipClients = appointments.filter(
    (a) =>
      (a.clientTier === "Kim Cương" || a.clientTier === "Bạch Kim") &&
      a.status !== "cancelled"
  );
  
  // Custom checklist toggle handler
  const handleToggle = (id: string) => {
    setChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Highlight operational alerts */}
      <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 flex items-center gap-3">
        <BadgeAlert className="text-red-500 shrink-0" size={24} />
        <div>
          <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider">
            Nhắc nhở quan trọng hôm nay
          </h4>
          <p className="text-[11px] text-dark-slate/80 leading-relaxed mt-0.5">
            Cần xử lý thủ tục check-in cho khách hàng đúng giờ hẹn. Đảm bảo vệ sinh phòng và chuẩn bị đồ uống trước khi tiếp đón.
          </p>
        </div>
      </div>

      {/* Section 1: Urgent Check-ins */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-dark-slate uppercase tracking-wider flex items-center gap-1.5">
          <Info size={14} className="text-blue-500" />
          Yêu cầu Check-in ({toCheckIn.length})
        </h4>

        {toCheckIn.length === 0 ? (
          <p className="text-xs text-on-surface-variant/80 italic text-center py-2 bg-white/40 rounded-lg border border-glass-border">
            Tất cả cuộc hẹn đã check-in hoặc hoàn tất.
          </p>
        ) : (
          <div className="space-y-2.5">
            {toCheckIn.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-4 rounded-xl border border-glass-border flex justify-between items-center text-xs"
              >
                <div>
                  <p className="font-bold text-dark-slate">{apt.clientName}</p>
                  <p className="text-[10px] text-on-surface-variant/80 mt-1">
                    Hẹn lúc {apt.startTime} ({apt.service || "Chưa chọn"})
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await onUpdateStatus(apt.id, "in_progress");
                      showToast(`Check-in thành công: ${apt.clientName}`, "success");
                    } catch {
                      showToast("Check-in thất bại. Vui lòng thử lại!", "error");
                    }
                  }}
                  className="bg-primary hover:bg-primary/95 text-white font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all text-[10px] shrink-0 cursor-pointer"
                >
                  Điểm danh
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: General Tasks Checklist */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-dark-slate uppercase tracking-wider">
          Checklist chuẩn bị & dịch vụ
        </h4>
        <div className="bg-white p-4 rounded-xl border border-glass-border space-y-3">
          {vipClients.length === 0 && toCheckIn.length === 0 ? (
            <p className="text-xs text-on-surface-variant/80 italic text-center py-2">
              Chưa có checklist đầu việc được tạo.
            </p>
          ) : (
            <div className="space-y-3">
              {/* Prepare VIP room task */}
              {vipClients.map((vip, idx) => {
                const taskId = `vip_prep_${vip.id}`;
                const checked = !!checklist[taskId];
                return (
                  <div key={taskId} className="flex items-start gap-3 text-xs">
                    <input
                      type="checkbox"
                      id={taskId}
                      checked={checked}
                      onChange={() => handleToggle(taskId)}
                      className="mt-0.5 accent-primary h-4 w-4 rounded border-gray-300 focus:ring-primary cursor-pointer shrink-0"
                    />
                    <label
                      htmlFor={taskId}
                      className={`leading-relaxed cursor-pointer font-medium select-none ${
                        checked ? "line-through text-on-surface-variant/50" : "text-dark-slate"
                      }`}
                    >
                      Dọn vệ sinh, thiết lập phòng VIP {idx + 1} đón tiếp khách <span className="font-bold">{vip.clientName}</span> ({vip.startTime})
                    </label>
                  </div>
                );
              })}

              {/* Call to confirm next day bookings */}
              <div className="flex items-start gap-3 text-xs border-t border-glass-border/30 pt-3">
                <input
                  type="checkbox"
                  id="confirm_tomorrow"
                  checked={!!checklist["confirm_tomorrow"]}
                  onChange={() => handleToggle("confirm_tomorrow")}
                  className="mt-0.5 accent-primary h-4 w-4 rounded border-gray-300 focus:ring-primary cursor-pointer shrink-0"
                />
                <label
                  htmlFor="confirm_tomorrow"
                  className={`leading-relaxed cursor-pointer font-medium select-none ${
                    checklist["confirm_tomorrow"]
                      ? "line-through text-on-surface-variant/50"
                      : "text-dark-slate"
                  }`}
                >
                  Gửi SMS tự động nhắc hẹn ngày mai cho khách hàng.
                </label>
              </div>

              {/* Sanitize therapy equipment */}
              <div className="flex items-start gap-3 text-xs">
                <input
                  type="checkbox"
                  id="sanitize_equip"
                  checked={!!checklist["sanitize_equip"]}
                  onChange={() => handleToggle("sanitize_equip")}
                  className="mt-0.5 accent-primary h-4 w-4 rounded border-gray-300 focus:ring-primary cursor-pointer shrink-0"
                />
                <label
                  htmlFor="sanitize_equip"
                  className={`leading-relaxed cursor-pointer font-medium select-none ${
                    checklist["sanitize_equip"]
                      ? "line-through text-on-surface-variant/50"
                      : "text-dark-slate"
                  }`}
                >
                  Khử trùng thiết bị xông hơi và trị liệu sau giờ cao điểm trưa.
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
