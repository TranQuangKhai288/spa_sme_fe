"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

let toastListeners: Array<(toast: ToastMessage) => void> = [];

export function showToast(
  message: string,
  type: ToastMessage["type"] = "success"
) {
  const toast: ToastMessage = { id: Date.now().toString(), type, message };
  toastListeners.forEach((fn) => fn(toast));
}

const ICONS: Record<ToastMessage["type"], string> = {
  success: "check_circle",
  error: "error",
  info: "info",
  warning: "warning",
};

const COLORS: Record<ToastMessage["type"], string> = {
  success: "border-jade-green/30 bg-jade-green/5 text-jade-green",
  error: "border-red-500/30 bg-red-500/5 text-red-500",
  info: "border-primary/30 bg-primary/5 text-primary",
  warning: "border-soft-gold/30 bg-soft-gold/5 text-soft-gold",
};

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (t: ToastMessage) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3500);
    };
    toastListeners.push(handler);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 z-[200] flex flex-col gap-2 sm:right-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-xl bg-white/80 animate-slide-in-right ${COLORS[t.type]}`}
        >
          <MaterialIcon name={ICONS[t.type]} className="text-[20px] shrink-0" filled />
          <span className="text-sm font-medium text-dark-slate">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
