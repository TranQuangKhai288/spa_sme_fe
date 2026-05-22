"use client";

import { useSpaData } from "@/hooks/useSpaData";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function WorkflowsView() {
  const { workflows, toggleWorkflow } = useSpaData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold text-dark-slate sm:text-3xl">
          Tự động hóa Marketing & Chăm sóc
        </h1>
        <p className="text-sm text-on-surface-variant/80">
          Quản lý workflow nhắc lịch, SMS và Zalo OA
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {workflows.map((wf) => (
          <GlassCard key={wf.id} className="p-6" hover>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-headline text-lg font-semibold text-dark-slate">
                  {wf.name}
                </h3>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Kích hoạt: {wf.trigger}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleWorkflow(wf.id)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  wf.active ? "bg-jade-green" : "bg-gray-300"
                }`}
                aria-pressed={wf.active}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    wf.active ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <p className="mb-4 text-xs text-on-surface-variant/80">
              Lọc: {wf.filter} • Đã gửi: {wf.totalSent.toLocaleString("vi-VN")}
            </p>

            <div className="flex flex-wrap gap-2">
              {wf.actions.map((action, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/50 px-3 py-2 text-xs"
                >
                  <MaterialIcon
                    name={action.icon}
                    className="text-jade-green text-[16px]"
                  />
                  <span>{action.label}</span>
                  <span className="text-on-surface-variant/60">
                    ({action.channel})
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
