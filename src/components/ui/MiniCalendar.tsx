"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSpaData } from "@/hooks/useSpaData";

interface MiniCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  children?: React.ReactNode;
}

// Helper to format Date objects as YYYY-MM-DD
const formatDateToYmd = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Helper to build 42-day calendar grid (starts on Monday)
const getDaysInMonthGrid = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  let firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday...
  if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Map Sunday to 7

  const prevMonthPaddingCount = firstDayOfWeek - 1;
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  const currentMonthDateCount = new Date(year, month + 1, 0).getDate();

  const days: { date: Date; isCurrentMonth: boolean; day: number }[] = [];

  const prevYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  for (let i = prevMonthPaddingCount - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDate - i;
    days.push({
      date: new Date(prevYear, prevMonth, dayNum),
      isCurrentMonth: false,
      day: dayNum,
    });
  }

  for (let i = 1; i <= currentMonthDateCount; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
      day: i,
    });
  }

  const totalCells = 42;
  const nextMonthPaddingCount = totalCells - days.length;
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  for (let i = 1; i <= nextMonthPaddingCount; i++) {
    days.push({
      date: new Date(nextYear, nextMonth, i),
      isCurrentMonth: false,
      day: i,
    });
  }

  return days;
};

export function MiniCalendar({ selectedDate, onSelectDate, children }: MiniCalendarProps) {
  const { appointments } = useSpaData();

  const [currentYear, setCurrentYear] = useState(() => {
    const parts = selectedDate.split("-").map(Number);
    return parts.length === 3 ? parts[0] : new Date().getFullYear();
  });
  
  const [currentMonth, setCurrentMonth] = useState(() => {
    const parts = selectedDate.split("-").map(Number);
    return parts.length === 3 ? parts[1] - 1 : new Date().getMonth();
  });

  // Sync visible month when selectedDate changes externally
  useEffect(() => {
    const parts = selectedDate.split("-").map(Number);
    if (parts.length === 3) {
      setCurrentYear(parts[0]);
      setCurrentMonth(parts[1] - 1);
    }
  }, [selectedDate]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const gridDays = getDaysInMonthGrid(currentYear, currentMonth);
  const realTodayStr = formatDateToYmd(new Date());
  const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 h-full border border-white/40 flex flex-col justify-between">
      <div>
        {/* Header containing Month & Year Selects + Chevrons */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex gap-1.5 items-center">
            {/* Month Select */}
            <div className="relative">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="appearance-none bg-transparent hover:bg-primary/10 text-primary font-bold pr-5 pl-2 py-1 rounded-lg cursor-pointer outline-none font-headline text-sm border-0 transition-colors"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i} className="text-dark-slate bg-white">
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
              <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-primary/70 text-[10px]">▼</span>
            </div>

            {/* Year Select */}
            <div className="relative">
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="appearance-none bg-transparent hover:bg-primary/10 text-primary font-bold pr-5 pl-2 py-1 rounded-lg cursor-pointer outline-none font-headline text-sm border-0 transition-colors"
              >
                {Array.from({ length: 11 }, (_, i) => {
                  const yr = new Date().getFullYear() - 5 + i;
                  return (
                    <option key={yr} value={yr} className="text-dark-slate bg-white">
                      {yr}
                    </option>
                  );
                })}
              </select>
              <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-primary/70 text-[10px]">▼</span>
            </div>
          </div>

          <div className="flex gap-1 text-on-surface-variant">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:text-primary hover:bg-white/40 rounded-full transition-all cursor-pointer flex items-center justify-center"
              aria-label="Tháng trước"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:text-primary hover:bg-white/40 rounded-full transition-all cursor-pointer flex items-center justify-center"
              aria-label="Tháng sau"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-on-surface-variant/60 uppercase mb-2">
          {weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm md:text-xs">
          {gridDays.map((dayObj, i) => {
            const cellDateStr = formatDateToYmd(dayObj.date);
            const isSelected = selectedDate === cellDateStr;
            const isToday = cellDateStr === realTodayStr;
            const hasAppointment = appointments.some(
              (apt) => apt.date === cellDateStr && apt.status !== "cancelled"
            );

            return (
              <div
                key={i}
                onClick={() => onSelectDate(cellDateStr)}
                className={`relative p-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer aspect-square font-medium ${
                  isSelected
                    ? "bg-primary text-white font-bold shadow-md shadow-primary/20"
                    : isToday
                      ? "bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary/20"
                      : dayObj.isCurrentMonth
                        ? "hover:bg-primary/10 text-dark-slate"
                        : "opacity-30 hover:bg-primary/5 text-on-surface-variant"
                }`}
              >
                {dayObj.day}
                {hasAppointment && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
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
