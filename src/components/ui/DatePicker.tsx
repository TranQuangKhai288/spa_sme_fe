"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  label,
  error,
  className = "",
  disabled = false,
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const parts = value.split("-").map(Number);
    if (parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, 1);
    }
    return new Date();
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarCells = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      month,
      year,
      isCurrentMonth: true,
    });
  }
  const totalCells = calendarCells.length;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    calendarCells.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
    });
  }

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  return (
    <div className={`relative text-sm w-full ${className}`} ref={calendarRef}>
      {label && (
        <span className="font-cta mb-1 block text-on-surface-variant font-medium">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          const parts = value.split("-").map(Number);
          if (parts.length === 3) {
            setCurrentMonth(new Date(parts[0], parts[1] - 1, 1));
          }
          setShowCalendar(!showCalendar);
        }}
        className={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-sm flex items-center justify-between text-dark-slate font-medium text-left outline-none transition-all ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-glass-border focus:border-primary/40 hover:border-primary/20"
        } ${
          disabled ? "bg-surface/50 text-on-surface-variant/70 cursor-not-allowed opacity-80" : "focus:ring-2 focus:ring-primary/20 hover:bg-white/70"
        }`}
      >
        <span>{formatDisplayDate(value)}</span>
        <Calendar size={18} className="text-on-surface-variant/80" />
      </button>

      {showCalendar && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-2xl border border-glass-border bg-white p-4 shadow-2xl backdrop-blur-xl animate-fadeIn min-w-[280px]">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-dark-slate text-sm">
              {monthNames[month]}, {year}
            </span>
            <div className="flex gap-1 text-on-surface-variant">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-primary/10 rounded-full transition-all flex items-center justify-center"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-primary/10 rounded-full transition-all flex items-center justify-center"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-on-surface-variant/70 mb-1">
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span>CN</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarCells.map((cell, idx) => {
              const cellDateStr = `${cell.year}-${String(cell.month + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
              const isSelected = value === cellDateStr;
              const today = new Date();
              const isToday =
                today.getDate() === cell.day &&
                today.getMonth() === cell.month &&
                today.getFullYear() === cell.year;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const y = cell.year;
                    const m = String(cell.month + 1).padStart(2, "0");
                    const d = String(cell.day).padStart(2, "0");
                    onChange(`${y}-${m}-${d}`);
                    setShowCalendar(false);
                  }}
                  className={`p-1.5 flex items-center justify-center rounded-lg text-xs transition-all ${
                    isSelected
                      ? "bg-primary text-white font-bold shadow-md shadow-primary/20"
                      : isToday
                        ? "border border-primary text-primary font-bold"
                        : cell.isCurrentMonth
                          ? "hover:bg-primary/10 text-dark-slate"
                          : "text-on-surface-variant/30"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {error && (
        <span className="text-red-500 text-xs mt-1 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
