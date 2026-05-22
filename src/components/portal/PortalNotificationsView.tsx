"use client";

import { useSpaData } from "@/hooks/useSpaData";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/Button";

export function PortalNotificationsView() {
  const { notifications, markAllNotificationsAsRead, deleteNotification } =
    useSpaData();

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-bold">{`Thông báo`}</h1>
        <Button size="sm" variant="ghost" onClick={markAllNotificationsAsRead}>
          {`Đánh dấu đã đọc`}
        </Button>
      </div>

      {notifications.map((n) => (
        <GlassCard
          key={n.id}
          className={`p-4 ${!n.read ? "border-l-4 border-jade-green" : ""}`}
        >
          <div className="flex gap-3">
            <MaterialIcon
              name={
                n.type === "success"
                  ? "check_circle"
                  : n.type === "warning"
                    ? "warning"
                    : "info"
              }
              className="shrink-0 text-jade-green"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="text-xs text-on-surface-variant">{n.message}</p>
              <p className="mt-1 text-[10px] text-on-surface-variant/60">
                {n.time}
              </p>
            </div>
            <button
              type="button"
              onClick={() => deleteNotification(n.id)}
              className="shrink-0 text-on-surface-variant/50"
              aria-label={`Xóa`}
            >
              <MaterialIcon name="close" className="text-[18px]" />
            </button>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
