"use client";

import { useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { formatVnd, formatDateString, statusBadgeClass, tierBadgeClass } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { AppointmentCard } from "./AppointmentCard";
import { CreateAppointmentModal } from "./CreateAppointmentModal";
import { EditAppointmentModal } from "./EditAppointmentModal";
import { showToast } from "@/components/ui/Toast";
import { useSearch } from "@/providers/SearchProvider";
import { ChevronDown, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { MiniCalendar } from "@/components/ui/MiniCalendar";

const FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "upcoming", label: "Sắp tới" },
  { id: "completed", label: "Hoàn tất" },
  { id: "cancelled", label: "Đã hủy" },
] as const;

export function AppointmentsView() {
  const {
    appointments,
    therapists,
    updateAppointmentStatus,
    deleteAppointment,
    currentUser,
  } = useSpaData();
  const [filter, setFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAptId, setEditAptId] = useState<string | null>(null);
  const [selectedApt, setSelectedApt] = useState<string | null>(null);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const { query: searchQuery } = useSearch();
  const [selectedTherapists, setSelectedTherapists] = useState<
    Record<string, boolean>
  >(Object.fromEntries(therapists.map((t) => [t.id, true])));

  const todayDate = new Date();
  const realTodayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
  
  const [selectedDate, setSelectedDate] = useState<string>(realTodayStr);

  const toggleTherapist = (id: string) => {
    setSelectedTherapists((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = (
    filter === "all"
      ? appointments
      : filter === "upcoming"
        ? appointments.filter(
          (a) => a.status === "confirmed" || a.status === "in_progress",
        )
        : appointments.filter((a) => a.status === filter)
  )
    .filter((a) => a.date === selectedDate)
    .filter((a) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (a.clientName && a.clientName.toLowerCase().includes(q)) ||
        (a.service && a.service.toLowerCase().includes(q)) ||
        (a.therapist && a.therapist.toLowerCase().includes(q))
      );
    });

  const visibleTherapists = therapists.filter((t) => selectedTherapists[t.id]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 09:00 to 20:00

  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h + m / 60;
  };

  const filterOptions = FILTERS.map((f) => ({
    value: f.id,
    label: f.label,
  }));

  return (
    <div className="space-y-6">
      {/* Header & Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary sm:text-3xl">
            Quản lý lịch hẹn
          </h1>
          <p className="text-sm text-on-surface-variant/80">
            {filtered.length} lịch hẹn
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status filter + Create button */}
          <div className="relative hidden md:block min-w-36">
            <Select
              value={filter}
              onChange={setFilter}
              options={filterOptions}
            />
          </div>
          {currentUser.role !== "technician" && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary/90 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Plus size={16} />
              Tạo lịch hẹn
            </button>
          )}
        </div>
      </div>

      {/* Main Body Area: Sidebar (left) + Timeline (right) layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar: Filters & Mini Calendar */}
        <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0 hidden md:flex">
          {/* Mini Calendar */}
          <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

          {/* Therapist Filter */}
          <GlassCard className="rounded-2xl p-6">
            <h3 className="font-headline text-base font-bold text-primary mb-4">
              Chuyên viên
            </h3>
            <div className="space-y-4">
              {therapists.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedTherapists[t.id] ?? false}
                    onChange={() => toggleTherapist(t.id)}
                    className="w-5 h-5 rounded border-glass-border text-jade-green focus:ring-jade-green/20"
                  />
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-8 h-8 rounded-full object-cover border border-glass-border"
                    />
                    <span className="text-sm font-medium group-hover:text-jade-green transition-colors text-dark-slate">
                      {t.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </GlassCard>
        </aside>

        {/* Desktop: Timeline Schedule View (Stitch UI Design) */}
        <section className="hidden md:flex flex-1 overflow-y-auto overflow-x-hidden flex-col glass-card p-0 rounded-2xl h-[750px] bg-white/30 backdrop-blur-3xl scroll-smooth">
          {/* Grid Header */}
          <div className="flex border-b border-surface-container bg-white/70 backdrop-blur-xl sticky top-0 z-40 w-full shadow-sm">
            <div className="w-20 p-4 shrink-0 text-center font-bold text-[10px] text-on-surface-variant/50 border-r border-surface-container flex items-center justify-center uppercase tracking-wider">
              TIME
            </div>
            <div
              className="flex-1 grid"
              style={{
                gridTemplateColumns: `repeat(${Math.max(1, visibleTherapists.length)}, minmax(0, 1fr))`,
              }}
            >
              {visibleTherapists.map((t) => (
                <div
                  key={t.id}
                  className="p-4 text-center border-r border-surface-container last:border-r-0 flex flex-col xl:flex-row items-center justify-center gap-2 xl:gap-3"
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-8 h-8 rounded-full border border-glass-border shadow-sm object-cover"
                  />
                  <span className="font-bold text-sm text-primary truncate max-w-full">
                    {t.name}
                  </span>
                </div>
              ))}
              {visibleTherapists.length === 0 && (
                <div className="p-4 text-center text-on-surface-variant/60">
                  Vui lòng chọn ít nhất 1 Nhân viên bên trái.
                </div>
              )}
            </div>
          </div>

          {/* Grid Body */}
          <div className="flex-1 relative w-full">
            {/* Wrapper to give grid height */}
            <div
              className="relative w-full"
              style={{ height: `${hours.length * 100}px` }}
            >
              {/* Time Rows */}
              <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="flex h-[100px] border-b border-surface-container/50"
                  >
                    <div className="w-20 text-center py-2 text-xs font-medium text-on-surface-variant/60 border-r border-surface-container shrink-0 bg-white/20">
                      {`${hour.toString().padStart(2, "0")}:00`}
                    </div>
                    <div
                      className="flex-1 grid"
                      style={{
                        gridTemplateColumns: `repeat(${Math.max(1, visibleTherapists.length)}, minmax(0, 1fr))`,
                      }}
                    >
                      {visibleTherapists.map((t) => (
                        <div
                          key={t.id}
                          className="border-r border-surface-container/50 border-dashed last:border-r-0"
                        ></div>
                      ))}
                      {visibleTherapists.length === 0 && <div></div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Absolute foreground for appointments */}
              <div className="absolute inset-0 z-10 flex ml-20">
                <div
                  className="flex-1 grid"
                  style={{
                    gridTemplateColumns: `repeat(${Math.max(1, visibleTherapists.length)}, minmax(0, 1fr))`,
                  }}
                >
                  {visibleTherapists.map((t) => {
                    const therapistApts = filtered.filter(
                      (a) => a.therapist === t.name || a.therapistId === t.id,
                    );
                    return (
                      <div key={t.id} className="relative h-full w-full">
                        {therapistApts.map((apt) => {
                          const startH = parseTime(apt.startTime);
                          const endH = parseTime(apt.endTime);
                          const top = (startH - 9) * 100;
                          const height = (endH - startH) * 100;

                          let colorClass =
                            "border-l-primary border-primary/20 hover:border-primary/40";
                          let textColor = "text-primary";
                          let labelBg = "bg-primary/10 text-primary";

                          if (apt.status === "completed") {
                            colorClass =
                              "border-l-jade-green border-jade-green/20 hover:border-jade-green/40";
                            textColor = "text-jade-green";
                            labelBg = "bg-jade-green/10 text-jade-green";
                          } else if (apt.status === "cancelled") {
                            colorClass =
                              "border-l-red-500 border-red-500/20 hover:border-red-500/40";
                            textColor = "text-red-500";
                            labelBg = "bg-red-500/10 text-red-500";
                          } else if (
                            apt.clientTier === "Kim Cương" ||
                            apt.clientTier === "Bạch Kim"
                          ) {
                            colorClass =
                              "border-l-soft-gold border-soft-gold/20 hover:border-soft-gold/40";
                            textColor = "text-soft-gold";
                            labelBg = "bg-soft-gold/10 text-soft-gold";
                          }

                          return (
                            <div
                              key={apt.id}
                              onClick={() => {
                                setEditAptId(apt.id);
                                setEditModalOpen(true);
                              }}
                              className={`absolute overflow-hidden w-[calc(100%-16px)] ml-[8px] bg-white rounded-xl p-3 md:p-3 border-l-4 border-y border-r shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:z-50 transition-all duration-300 cursor-pointer pointer-events-auto flex flex-col justify-between ${colorClass}`}
                              style={{
                                top: `${top + 1}px`,
                                height: `${(endH - startH) * 100 - 2}px`,
                                zIndex: 10,
                              }}
                            >
                              <div className="w-full flex justify-between items-start gap-1">
                                <h4 className="font-bold text-dark-slate truncate pr-2 flex-1 leading-tight">
                                  {apt.clientName}
                                </h4>
                                <span
                                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${labelBg}`}
                                >
                                  {apt.status === "confirmed"
                                    ? "sắp tới"
                                    : apt.statusLabel}
                                </span>
                              </div>

                              <div className="w-full">
                                <p
                                  className={`text-xs font-bold truncate ${textColor} mb-1.5 ${!apt.service ? "italic text-red-500/80 font-medium" : ""}`}
                                >
                                  {apt.service || "Chưa chọn dịch vụ (Bấm để chọn)"}
                                </p>
                                <div className="flex items-center text-[11px] font-medium text-on-surface-variant/80 w-full">
                                  <span className="flex items-center gap-1 opacity-70">
                                    <Clock size={12} />
                                    {apt.startTime} - {apt.endTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile: calendar & date selector */}
      <div className="md:hidden space-y-4 mb-4">
        <GlassCard className="p-4 rounded-2xl border border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary flex items-center gap-2">
              <Clock size={16} /> Ngày xem: {formatDateString(selectedDate)}
            </span>
            <button
              onClick={() => setShowMobileCalendar(!showMobileCalendar)}
              className="text-xs text-jade-green font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              {showMobileCalendar ? "Thu gọn" : "Đổi ngày"}
            </button>
          </div>
          {showMobileCalendar && (
            <div className="mt-3 pt-3 border-t border-glass-border">
              <MiniCalendar
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setShowMobileCalendar(false);
                }}
              />
            </div>
          )}
        </GlassCard>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <GlassCard className="p-10 text-center text-sm text-on-surface-variant">
            Không có lịch hẹn
          </GlassCard>
        ) : (
          filtered.map((apt) => (
            <AppointmentCard
              key={apt.id}
              apt={apt}
              onCheckIn={
                apt.status === "confirmed"
                  ? () => updateAppointmentStatus(apt.id, "in_progress")
                  : undefined
              }
              onDelete={() => deleteAppointment(apt.id)}
              onClick={() => {
                setEditAptId(apt.id);
                setEditModalOpen(true);
              }}
            />
          ))
        )}
      </div>

      {modalOpen && (
        <CreateAppointmentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={(date) => {
            setSelectedDate(date);
          }}
        />
      )}

      {editModalOpen && (
        <EditAppointmentModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          aptId={editAptId}
        />
      )}
    </div>
  );
}
