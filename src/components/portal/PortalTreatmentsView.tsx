"use client";

import { useSpaData } from "@/hooks/useSpaData";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function PortalTreatmentsView() {
  const { treatmentProgress } = useSpaData();

  return (
    <div className="space-y-4 pb-4">
      <h1 className="font-headline text-2xl font-bold">
        {`Theo dõi liệu trình`}
      </h1>
      <p className="text-sm text-on-surface-variant">
        {`Theo dõi tiến độ liệu trình và gợi ý chăm sóc`}
      </p>

      {treatmentProgress.map((tp) => {
        const pct = Math.round((tp.completedSessions / tp.totalSessions) * 100);
        return (
          <GlassCard key={tp.id} className="p-5">
            <div className="flex gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="rgba(0,0,0,0.05)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className={
                      tp.color === "gold"
                        ? "stroke-soft-gold"
                        : "stroke-jade-green"
                    }
                    strokeWidth="3"
                    strokeDasharray={`${pct}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-bold">
                  {tp.completedSessions}/{tp.totalSessions}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{tp.packageName}</h3>
                <p className="text-xs text-on-surface-variant">
                  {`Khách:`} {tp.clientName}
                </p>
                <p className="mt-2 flex items-center gap-1 text-[10px] font-bold text-jade-green">
                  <MaterialIcon name="calendar_today" className="text-[12px]" />
                  {`Hẹn tiếp: ${tp.nextDate} ${tp.nextTime}`}
                </p>
                <p className="mt-2 text-xs text-on-surface-variant/80">
                  {`Skincare: Serum Vitamin C buổi sáng, kem dưỡng ẩm buổi tối.`}
                </p>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
