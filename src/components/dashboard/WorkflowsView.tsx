"use client";

import { useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { showToast } from "@/components/ui/Toast";

const CHANNEL_COLORS: Record<string, string> = {
  SMS: "bg-soft-gold/10 text-soft-gold border-soft-gold/20",
  "Zalo OA": "bg-primary/10 text-primary border-primary/20",
  Email: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Push Notification": "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

const STATS = [
  { label: "Workflows đang chạy", value: "3", icon: "play_circle", color: "text-jade-green" },
  { label: "Tổng tin nhắn đã gửi", value: "2,847", icon: "send", color: "text-primary" },
  { label: "Tỉ lệ mở", value: "68%", icon: "mark_email_read", color: "text-soft-gold" },
  { label: "Lịch hẹn từ workflow", value: "142", icon: "calendar_month", color: "text-purple-500" },
];

export function WorkflowsView() {
  const { workflows, toggleWorkflow } = useSpaData();
  const [showNewModal, setShowNewModal] = useState(false);

  const handleToggle = (id: string, name: string, currentActive: boolean) => {
    toggleWorkflow(id);
    showToast(
      currentActive ? `Đã tắt workflow "${name}"` : `Đã kích hoạt workflow "${name}"`,
      currentActive ? "warning" : "success"
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-dark-slate sm:text-3xl">
            Tự động hóa Marketing & Chăm sóc
          </h1>
          <p className="text-sm text-on-surface-variant/80">
            Quản lý workflow nhắc lịch, SMS, Zalo OA và Email
          </p>
        </div>
        <button
          onClick={() => { setShowNewModal(true); showToast("Tính năng tạo workflow đang phát triển", "info"); }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <MaterialIcon name="add" className="text-[18px]" />
          Tạo workflow mới
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <GlassCard key={stat.label} className="p-5 rounded-2xl">
            <div className="flex items-start gap-3">
              <MaterialIcon name={stat.icon} className={`text-[28px] ${stat.color}`} filled />
              <div>
                <p className="font-headline text-2xl font-bold text-dark-slate">{stat.value}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{stat.label}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {workflows.map((wf) => (
          <GlassCard key={wf.id} className="p-6 rounded-2xl" hover>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${wf.active ? "bg-jade-green animate-pulse" : "bg-gray-300"}`} />
                  <h3 className="font-headline text-base font-bold text-dark-slate truncate">
                    {wf.name}
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Trigger: <span className="font-medium text-dark-slate">{wf.trigger}</span>
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Lọc: <span className="font-medium text-dark-slate">{wf.filter}</span>
                </p>
              </div>
              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => handleToggle(wf.id, wf.name, wf.active)}
                className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${
                  wf.active ? "bg-jade-green shadow-lg shadow-jade-green/20" : "bg-gray-200"
                }`}
                aria-pressed={wf.active}
                title={wf.active ? "Tắt workflow" : "Bật workflow"}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                    wf.active ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-white/30">
              <div className="text-center">
                <p className="font-bold text-jade-green">{wf.totalSent.toLocaleString("vi-VN")}</p>
                <p className="text-[10px] text-on-surface-variant">Đã gửi</p>
              </div>
              <div className="h-8 w-px bg-glass-border" />
              <div className="text-center">
                <p className="font-bold text-primary">{wf.active ? "Đang chạy" : "Đã dừng"}</p>
                <p className="text-[10px] text-on-surface-variant">Trạng thái</p>
              </div>
            </div>

            {/* Action chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {wf.actions.map((action, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium ${
                    CHANNEL_COLORS[action.channel] ?? "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  <MaterialIcon
                    name={action.icon}
                    className="text-[15px]"
                  />
                  <span>{action.label}</span>
                  <span className="opacity-60">• {action.channel}</span>
                </div>
              ))}
            </div>

            {/* Footer actions */}
            <div className="flex gap-2 pt-3 border-t border-glass-border">
              <button
                onClick={() => showToast(`Đang mở editor cho "${wf.name}"`, "info")}
                className="flex-1 text-xs font-bold border border-glass-border text-dark-slate hover:bg-white/40 rounded-xl py-2 flex items-center justify-center gap-1 transition-all"
              >
                <MaterialIcon name="edit" className="text-[15px]" />
                Chỉnh sửa
              </button>
              <button
                onClick={() => showToast(`Đã nhân bản workflow "${wf.name}"`, "success")}
                className="flex-1 text-xs font-bold border border-glass-border text-dark-slate hover:bg-white/40 rounded-xl py-2 flex items-center justify-center gap-1 transition-all"
              >
                <MaterialIcon name="content_copy" className="text-[15px]" />
                Nhân bản
              </button>
              <button
                onClick={() => showToast(`Xem báo cáo workflow (mock)`, "info")}
                className="rounded-xl border border-glass-border text-dark-slate hover:bg-white/40 px-3 py-2 transition-all"
              >
                <MaterialIcon name="bar_chart" className="text-[18px]" />
              </button>
            </div>
          </GlassCard>
        ))}

        {/* Add New Workflow Placeholder Card */}
        <button
          onClick={() => showToast("Tính năng tạo workflow đang phát triển", "info")}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-glass-border p-10 hover:border-primary/40 hover:bg-primary/5 transition-all group"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <MaterialIcon name="add" className="text-primary text-[28px]" />
          </div>
          <p className="font-bold text-on-surface-variant group-hover:text-primary transition-colors">
            Tạo workflow mới
          </p>
          <p className="text-xs text-on-surface-variant/60 text-center max-w-40">
            Tự động hóa nhắc lịch, upsell và chăm sóc sau điều trị
          </p>
        </button>
      </div>
    </div>
  );
}
