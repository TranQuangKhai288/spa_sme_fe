"use client";

import { useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { GlassCard } from "@/components/ui/GlassCard";
import { showToast } from "@/components/ui/Toast";
import {
  PlayCircle,
  Send,
  MailCheck,
  Calendar,
  Plus,
  Pencil,
  Copy,
  BarChart2,
  MessageSquare,
  Mail,
  Gift,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  play_circle: PlayCircle,
  send: Send,
  mark_email_read: MailCheck,
  calendar_month: Calendar,
  add: Plus,
  edit: Pencil,
  content_copy: Copy,
  bar_chart: BarChart2,
  sms: MessageSquare,
  chat: MessageSquare,
  mail: Mail,
  card_giftcard: Gift,
};

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
  const { workflows, toggleWorkflow, currentUser } = useSpaData();
  const [showNewModal, setShowNewModal] = useState(false);

  const handleToggle = async (id: string, name: string, currentActive: boolean) => {
    try {
      await toggleWorkflow(id);
      showToast(
        currentActive ? `Đã tắt workflow "${name}"` : `Đã kích hoạt workflow "${name}"`,
        currentActive ? "warning" : "success"
      );
    } catch {
      showToast(`Không thể thay đổi trạng thái workflow. Vui lòng thử lại!`, "error");
    }
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
        {currentUser.role === "admin" && (
          <button
            onClick={() => { setShowNewModal(true); showToast("Tính năng tạo workflow đang phát triển", "info"); }}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Tạo workflow mới
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const IconComponent = iconMap[stat.icon] || PlayCircle;
          return (
            <GlassCard key={stat.label} className="p-5 rounded-2xl">
              <div className="flex items-start gap-3">
                <IconComponent className={`text-[28px] ${stat.color}`} size={28} />
                <div>
                  <p className="font-headline text-2xl font-bold text-dark-slate">{stat.value}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{stat.label}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
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
                onClick={() => {
                  if (currentUser.role !== "admin") {
                    showToast("Quyền truy cập bị từ chối. Chỉ Quản trị viên được bật/tắt workflow.", "error");
                    return;
                  }
                  handleToggle(wf.id, wf.name, wf.active);
                }}
                className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${
                  wf.active ? "bg-jade-green shadow-lg shadow-jade-green/20" : "bg-gray-200"
                } ${currentUser.role !== "admin" ? "cursor-not-allowed opacity-75" : ""}`}
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
              {wf.actions.map((action, i) => {
                const ActionIcon = iconMap[action.icon] || MessageSquare;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium ${
                      CHANNEL_COLORS[action.channel] ?? "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    <ActionIcon size={15} />
                    <span>{action.label}</span>
                    <span className="opacity-60">• {action.channel}</span>
                  </div>
                );
              })}
            </div>

            {/* Footer actions */}
            <div className="flex gap-2 pt-3 border-t border-glass-border">
              {currentUser.role === "admin" && (
                <>
                  <button
                    onClick={() => showToast(`Đang mở editor cho "${wf.name}"`, "info")}
                    className="flex-1 text-xs font-bold border border-glass-border text-dark-slate hover:bg-white/40 rounded-xl py-2 flex items-center justify-center gap-1 transition-all"
                  >
                    <Pencil size={15} />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => showToast(`Đã nhân bản workflow "${wf.name}"`, "success")}
                    className="flex-1 text-xs font-bold border border-glass-border text-dark-slate hover:bg-white/40 rounded-xl py-2 flex items-center justify-center gap-1 transition-all"
                  >
                    <Copy size={15} />
                    Nhân bản
                  </button>
                </>
              )}
              <button
                onClick={() => showToast(`Xem báo cáo workflow (mock)`, "info")}
                className={`rounded-xl border border-glass-border text-dark-slate hover:bg-white/40 px-3 py-2 transition-all flex items-center justify-center ${currentUser.role !== "admin" ? "w-full py-2.5" : ""}`}
              >
                <BarChart2 size={18} />
                {currentUser.role !== "admin" && <span className="ml-2 text-xs font-bold">Xem báo cáo chi tiết</span>}
              </button>
            </div>
          </GlassCard>
        ))}

        {/* Add New Workflow Placeholder Card */}
        {currentUser.role === "admin" && (
          <button
            onClick={() => showToast("Tính năng tạo workflow đang phát triển", "info")}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-glass-border p-10 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="text-primary text-[28px]" size={28} />
            </div>
            <p className="font-bold text-on-surface-variant group-hover:text-primary transition-colors">
              Tạo workflow mới
            </p>
            <p className="text-xs text-on-surface-variant/60 text-center max-w-40">
              Tự động hóa nhắc lịch, upsell và chăm sóc sau điều trị
            </p>
          </button>
        )}
      </div>
    </div>
  );
}
