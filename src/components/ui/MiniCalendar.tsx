"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSpaData } from "@/hooks/useSpaData";

interface MiniCalendarProps {
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  children?: React.ReactNode;
}

export function MiniCalendar({ selectedDayIndex, onSelectDay, children }: MiniCalendarProps) {
  const { calendarDays, appointments } = useSpaData();

  const todayDate = new Date();
  const realTodayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    const todayIdx = calendarDays.findIndex((dayObj) => {
      const dayDateStr = dayObj.isCurrentMonth
        ? `2026-05-${dayObj.day.toString().padStart(2, "0")}`
        : dayObj.day >= 15
          ? `2026-04-${dayObj.day.toString().padStart(2, "0")}`
          : `2026-06-${dayObj.day.toString().padStart(2, "0")}`;
      return dayDateStr === realTodayStr;
    });

    if (todayIdx !== -1 && selectedDayIndex !== todayIdx) {
      onSelectDay(todayIdx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarDays]);

  const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 h-full border border-white/40 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h3 className="font-headline text-base font-bold text-primary">
            Tháng 5, 2026
          </h3>
          <div className="flex gap-1 text-on-surface-variant">
            <button className="p-1 hover:text-primary hover:bg-white/40 rounded-full transition-all">
              <ChevronLeft size={18} />
            </button>
            <button className="p-1 hover:text-primary hover:bg-white/40 rounded-full transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-on-surface-variant/60 uppercase mb-2">
          {weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm md:text-xs">
          {calendarDays.map((dayObj, i) => {
            const isSelected = selectedDayIndex === i;
            const dayDateStr = dayObj.isCurrentMonth
              ? `2026-05-${dayObj.day.toString().padStart(2, "0")}`
              : dayObj.day >= 15
                ? `2026-04-${dayObj.day.toString().padStart(2, "0")}`
                : `2026-06-${dayObj.day.toString().padStart(2, "0")}`;
            const hasAppointment = appointments.some(
              (apt) => apt.date === dayDateStr && apt.status !== "cancelled"
            );
            return (
              <div
                key={i}
                onClick={() => onSelectDay(i)}
                className={`relative p-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white font-bold shadow-md shadow-primary/20"
                    : dayDateStr === realTodayStr
                      ? "bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary/20"
                      : dayObj.isCurrentMonth
                        ? "hover:bg-primary/10 text-dark-slate"
                        : "opacity-30 text-on-surface-variant"
                }`}
              >
                {dayObj.day}
                {hasAppointment && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  );
}
