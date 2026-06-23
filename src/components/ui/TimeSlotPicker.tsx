"use client";

interface Slot {
  time: string;
  available: boolean;
  busyCount: number;
  totalTherapists: number;
}

interface TimeSlotPickerProps {
  slots: Slot[];
  value: string;
  onChange: (time: string) => void;
  loading?: boolean;
  error?: string;
}

export function TimeSlotPicker({
  slots,
  value,
  onChange,
  loading = false,
  error,
}: TimeSlotPickerProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-1.5 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-glass-border/40" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-xs text-on-surface-variant/60 text-center py-3">
        Chọn ngày để xem khung giờ trống
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-4 gap-1.5">
        {slots.map((slot) => {
          const isSelected = value === slot.time;
          const isFull = !slot.available;

          return (
            <button
              key={slot.time}
              type="button"
              disabled={isFull}
              onClick={() => !isFull && onChange(slot.time)}
              title={
                isFull
                  ? `Đã hết lịch (${slot.busyCount}/${slot.totalTherapists} nhân viên bận)`
                  : `Còn ${slot.totalTherapists - slot.busyCount}/${slot.totalTherapists} nhân viên rảnh`
              }
              className={`
                relative h-9 rounded-lg text-xs font-semibold transition-all select-none
                ${isSelected
                  ? "bg-primary text-white shadow-md shadow-primary/30 scale-[1.03]"
                  : isFull
                    ? "bg-red-50 text-red-300 border border-red-100 cursor-not-allowed line-through"
                    : "bg-white border border-glass-border text-dark-slate hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                }
              `}
            >
              {slot.time}
              {isFull && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border border-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 pt-1 text-[10px] text-on-surface-variant/50">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded bg-white border border-glass-border" />
          Còn trống
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded bg-red-50 border border-red-100" />
          Hết lịch
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded bg-primary" />
          Đã chọn
        </span>
      </div>

      {error && (
        <span className="text-red-500 text-xs mt-1 block font-medium">{error}</span>
      )}
    </div>
  );
}
