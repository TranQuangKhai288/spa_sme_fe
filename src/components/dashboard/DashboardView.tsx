"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import {
  formatLocaleDate,
  statusBadgeClass,
  tierBadgeClass,
} from "@/lib/utils";
import { useSpaData } from "@/hooks/useSpaData";
import { localizedStatus } from "@/hooks/useLocalizedStatus";
import { showToast } from "@/components/ui/Toast";

export default function DashboardView() {
  const weekdays = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const {
    stats,
    appointments,
    treatmentProgress,
    calendarDays,
    updateAppointmentStatus,
    deleteAppointment,
  } = useSpaData();

  const [selectedDate, setSelectedDate] = useState<number | null>(
    new Date().getDate(),
  );

  const todayLabel = formatLocaleDate(new Date(), "vi", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary mb-1 sm:text-3xl">
            {`Trung tâm điều hành`}
          </h1>
          <p className="text-on-surface-variant/80 text-sm">
            {`Cập nhật hoạt động kinh doanh ngày ${todayLabel}`}
          </p>
        </div>
        <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2 border border-jade-green/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-jade-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-jade-green"></span>
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase text-jade-green">
            {`Hệ thống đang hoạt động`}
          </span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between bg-linear-to-brrom-primary/5 to-transparent border border-white/40 hover:scale-[1.02] transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-jade-green/80 uppercase tracking-widest block mb-2 font-cta">
              {`Tổng Booking Hôm Nay`}
            </span>
            <span className="font-headline text-4xl font-bold text-dark-slate">
              {stats.totalBookingsToday}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-jade-green text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">
              trending_up
            </span>
            <span>{`${stats.revenueTrend} so với hôm qua`}</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between bg-linear-to-br from-soft-gold/10 to-transparent border border-white/40 hover:scale-[1.02] transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-soft-gold uppercase tracking-widest block mb-2 font-cta">
              {`Khách VIP Hôm Nay`}
            </span>
            <span className="font-headline text-4xl font-bold text-dark-slate">
              {String(stats.vipClients).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-soft-gold text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">star</span>
            <span>{`Ưu tiên chăm sóc VIP`}</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between bg-linear-to-br from-primary/5 to-transparent border border-white/40 hover:scale-[1.02] transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-jade-green/80 uppercase tracking-widest block mb-2 font-cta">
              {`Doanh Thu Ước Tính`}
            </span>
            <span className="font-headline text-4xl font-bold text-dark-slate">
              {stats.revenueToday}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-jade-green/80 text-xs">
            <span>{`VND • Đạt ${stats.revenueTarget}% mục tiêu ngày`}</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between bg-linear-to-br from-red-500/5 to-transparent border border-red-500/10 hover:scale-[1.02] transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest block mb-2 font-cta">
              {`Nhắc nhở chưa xử lý`}
            </span>
            <span className="font-headline text-4xl font-bold text-red-500">
              {stats.pendingReminders}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-red-500 text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">
              priority_high
            </span>
            <span>{`Cần xử lý tự động ngay`}</span>
          </div>
        </div>
      </div>

      {/* Main Row: Calendar and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Mini Calendar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="glass-card p-5 rounded-2xl h-full border border-white/40 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline font-bold text-dark-slate text-base">
                  {`Tháng 5, 2026`}
                </h3>
                <div className="flex gap-1">
                  <button className="material-symbols-outlined text-[18px] p-1.5 hover:bg-white/40 rounded-full transition-all">
                    chevron_left
                  </button>
                  <button className="material-symbols-outlined text-[18px] p-1.5 hover:bg-white/40 rounded-full transition-all">
                    chevron_right
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {weekdays.map((day) => (
                  <span
                    key={day}
                    className="text-[10px] font-bold text-on-surface-variant/60 uppercase"
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {calendarDays.map((dayObj, i) => {
                  const isSelected =
                    selectedDate === dayObj.day && dayObj.isCurrentMonth;
                  return (
                    <div
                      key={i}
                      onClick={() =>
                        dayObj.isCurrentMonth && setSelectedDate(dayObj.day)
                      }
                      className={`relative p-1.5 text-xs rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-primary text-white font-bold shadow-md shadow-primary/20 cursor-pointer"
                          : dayObj.isToday
                            ? "border border-primary text-primary font-bold cursor-pointer"
                            : dayObj.isCurrentMonth
                              ? "hover:bg-primary/10 cursor-pointer text-dark-slate"
                              : "text-on-surface-variant/30"
                      }`}
                    >
                      {dayObj.day}
                      {dayObj.hasAppointment && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-glass-border">
              <h4 className="text-[10px] font-bold text-on-surface-variant/80 uppercase mb-2 tracking-widest">
                {`Ghi chú hoạt động`}
              </h4>
              <p className="text-xs italic text-on-surface-variant/70 leading-relaxed">
                {`Hôm nay có sự kiện đặc biệt tri ân khách hàng VIP tại chi nhánh 1. Chú ý nhắc nhở các liệu trình trị liệu da chuyên sâu đúng hẹn.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Timeline Appointments */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h3 className="font-headline font-bold text-lg flex items-center gap-2">
              {selectedDate === new Date().getDate()
                ? `Lịch hẹn hôm nay`
                : `Lịch hẹn ngày ${selectedDate}`}
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                {selectedDate === new Date().getDate()
                  ? `${stats.availableSlots} chỗ trống`
                  : "Đã lên lịch"}
              </span>
            </h3>
            <div className="flex gap-2">
              <Link
                href={ROUTES.appointments}
                className="bg-primary text-white font-cta font-medium text-xs px-4 py-2 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">
                  calendar_month
                </span>
                {`Xem tất cả`}
              </Link>
            </div>
          </div>

          <div className="space-y-4 max-h-125 overflow-y-auto scrollbar-hide pr-1">
            {appointments.length === 0 ||
            (selectedDate !== new Date().getDate() && selectedDate !== 24) ? (
              <div className="glass-card p-12 rounded-2xl text-center border border-white/40">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3 block">
                  calendar_today
                </span>
                <p className="text-on-surface-variant/80 text-sm">
                  {`Chưa có lịch hẹn nào được ghi nhận cho ngày ${selectedDate}.`}
                </p>
              </div>
            ) : (
              appointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`glass-card p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between border border-white/40 transition-all duration-300 hover:bg-white/45 group ${
                    apt.status === "cancelled" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      alt={apt.clientName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                      src={apt.clientAvatar}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-dark-slate text-sm">
                          {apt.clientName}
                        </h4>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full ${tierBadgeClass(apt.clientTier)}`}
                        >
                          {apt.clientTier}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant/80">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-primary">
                            spa
                          </span>
                          {apt.service}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            person
                          </span>
                          {`KTV`}: {apt.therapist}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>
                          {apt.startTime} - {apt.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-glass-border">
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusBadgeClass(apt.status)}`}
                    >
                      {localizedStatus(apt.status)}
                    </span>

                    <div className="flex items-center gap-2">
                      {apt.status === "confirmed" && (
                        <button
                          onClick={() => {
                            updateAppointmentStatus(apt.id, "in_progress");
                            showToast(`Check-in thành công: ${apt.clientName}`, "success");
                          }}
                          className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-md shadow-primary/5 hover:shadow-primary/10"
                        >
                          {`Điểm danh`}
                        </button>
                      )}
                      {apt.status === "in_progress" && (
                        <button
                          onClick={() => {
                            updateAppointmentStatus(apt.id, "completed");
                            showToast(`Hoàn tất liệu trình: ${apt.clientName}`, "success");
                          }}
                          className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                        >
                          {`Hoàn tất`}
                        </button>
                      )}
                      {apt.status !== "completed" &&
                        apt.status !== "cancelled" && (
                          <button
                            onClick={() => {
                              updateAppointmentStatus(apt.id, "cancelled");
                              showToast(`Đã hủy lịch: ${apt.clientName}`, "warning");
                            }}
                            className="border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs px-3 py-1.5 rounded-lg transition-all"
                          >
                            {`Hủy`}
                          </button>
                        )}
                      <button
                        onClick={() => {
                          deleteAppointment(apt.id);
                          showToast("Đã xóa lịch hẹn", "info");
                        }}
                        className="material-symbols-outlined text-on-surface-variant/50 hover:text-red-500 p-1.5 rounded-lg transition-colors text-[18px]"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Treatment Progress Packages */}
      <section className="space-y-6">
        <h3 className="font-headline font-bold text-lg">
          {`Tiến độ liệu trình gói`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatmentProgress.map((tp) => {
            const percentage = Math.round(
              (tp.completedSessions / tp.totalSessions) * 100,
            );
            const dashArray = `${percentage}, 100`;
            const colorClass =
              tp.color === "gold" ? "stroke-soft-gold" : "stroke-jade-green";
            const textBgColorClass =
              tp.color === "gold"
                ? "text-soft-gold bg-soft-gold/10"
                : "text-jade-green bg-jade-green/10";

            return (
              <div
                key={tp.id}
                className="glass-card p-5 rounded-2xl flex items-center gap-5 border border-white/40 hover:scale-[1.01] transition-transform duration-300"
              >
                {/* SVG Progress Circle */}
                <div className="relative w-18 h-18 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      className="stroke-black/5"
                      cx="18"
                      cy="18"
                      fill="none"
                      r="16"
                      strokeWidth="3"
                    ></circle>
                    <circle
                      className={colorClass}
                      cx="18"
                      cy="18"
                      fill="none"
                      r="16"
                      strokeDasharray={dashArray}
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-extrabold text-dark-slate">
                      {tp.completedSessions}/{tp.totalSessions}
                    </span>
                    <span className="text-[7px] uppercase tracking-wider text-on-surface-variant/75">
                      {`Buổi`}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-dark-slate text-sm mb-0.5">
                    {tp.packageName}
                  </h4>
                  <p className="text-xs text-on-surface-variant/80">
                    {`Khách`}: {tp.clientName}
                  </p>
                  <div
                    className={`mt-3 px-2 py-1 rounded-lg inline-flex items-center gap-1.5 text-[9px] font-bold ${textBgColorClass}`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      calendar_today
                    </span>
                    <span>{`Hẹn tiếp: ${tp.nextDate} lúc ${tp.nextTime}`}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Automation Workflow Builder */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg">
            {`Tự động hóa Marketing & Chăm sóc`}
          </h3>
          <Link
            href={ROUTES.workflows}
            className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
          >
            {`Tất cả workflows`}
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="glass-card rounded-2xl border border-white/40 bg-milky-white/60 p-4 sm:p-6">
          <div className="flex flex-col gap-4 py-2 lg:flex-row lg:items-center lg:justify-between">
            {/* Trigger Card */}
            <div className="glass-card w-full rounded-2xl border-l-4 border-jade-green bg-white p-5 shadow-md lg:w-64">
              <span className="text-[9px] font-bold text-jade-green uppercase tracking-widest block mb-1">
                {`Kích hoạt`}
              </span>
              <h5 className="font-bold text-dark-slate text-sm mb-3">
                {`1 ngày trước lịch hẹn`}
              </h5>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant/80">
                <span className="material-symbols-outlined text-jade-green text-[18px]">
                  calendar_today
                </span>
                <span>{`Tất cả lịch đã xác nhận`}</span>
              </div>
            </div>

            <div className="flex items-center justify-center py-1 lg:flex-1 lg:px-4">
              <span className="rounded-full border border-glass-border bg-white px-3 py-1 text-[9px] font-bold text-on-surface-variant/80 lg:hidden">
                {`Lọc: Đã xác nhận`}
              </span>
              <div className="relative hidden h-0.5 flex-1 bg-jade-green/35 lg:block">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-glass-border bg-white px-3 py-1 text-[9px] font-bold text-on-surface-variant/80">
                  {`Lọc: Đã xác nhận`}
                </div>
              </div>
            </div>

            <div className="glass-card w-full rounded-2xl border-l-4 border-soft-gold bg-white p-5 shadow-md lg:w-64">
              <span className="text-[9px] font-bold text-soft-gold uppercase tracking-widest block mb-1">
                {`Hành động: SMS thương hiệu`}
              </span>
              <h5 className="font-bold text-dark-slate text-sm mb-3">
                {`Nhắc lịch tự động`}
              </h5>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant/80">
                <span className="material-symbols-outlined text-soft-gold text-[18px]">
                  sms
                </span>
                <span>{`Mẫu SMS Tiêu Chuẩn`}</span>
              </div>
            </div>

            <div className="hidden h-0.5 flex-1 bg-jade-green/35 lg:block" />

            <div className="glass-card w-full rounded-2xl border-l-4 border-primary bg-white p-5 shadow-md lg:w-64">
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-1">
                {`Hành động: Zalo OA`}
              </span>
              <h5 className="font-bold text-dark-slate text-sm mb-3">
                {`Gửi ưu đãi đi kèm`}
              </h5>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant/80">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  chat
                </span>
                <span>{`Mã giảm giá dịch vụ phụ`}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
