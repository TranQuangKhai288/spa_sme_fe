"use client";

import { useState, useRef, useEffect } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const NOTIF_TYPE_ICON: Record<string, string> = {
  success: "check_circle",
  warning: "warning",
  info: "info",
  reminder: "notifications_active",
};

const NOTIF_TYPE_COLOR: Record<string, string> = {
  success: "text-jade-green",
  warning: "text-soft-gold",
  info: "text-primary",
  reminder: "text-red-500",
};

export function NotificationsDropdown() {
  const { notifications, markAllNotificationsAsRead, deleteNotification } =
    useSpaData();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open && unread > 0) markAllNotificationsAsRead();
        }}
        className="relative rounded-full p-2 transition-colors hover:bg-white/40"
        aria-label="Thông báo"
      >
        <MaterialIcon name="notifications" className="text-dark-slate text-[22px]" />
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50 rounded-2xl border border-glass-border bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border">
            <span className="font-bold text-sm text-dark-slate">Thông báo</span>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
            >
              Đánh dấu đã đọc
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-glass-border/30">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-on-surface-variant">
                Không có thông báo nào
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-white/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <MaterialIcon
                    name={NOTIF_TYPE_ICON[n.type] ?? "info"}
                    className={`text-[20px] shrink-0 mt-0.5 ${NOTIF_TYPE_COLOR[n.type] ?? "text-primary"}`}
                    filled
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-dark-slate">{n.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-on-surface-variant/60 mt-1">
                      {n.time}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="shrink-0 p-1 rounded-full hover:bg-red-500/10 text-on-surface-variant/40 hover:text-red-500 transition-colors"
                  >
                    <MaterialIcon name="close" className="text-[14px]" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
