"use client";

export function localizedStatus(status: string): string {
  const map: Record<string, string> = {
    confirmed: "Đã xác nhận",
    in_progress: "Đang xử lý",
    completed: "Hoàn tất",
    cancelled: "Đã hủy",
  };
  return map[status] ?? status;
}
