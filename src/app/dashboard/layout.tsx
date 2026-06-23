"use client";

import { useCallback, type ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { usePathname } from "next/navigation";
import { useLocale } from "@/providers/LocaleProvider";
import { useOperatorPusher } from "@/hooks/useOperatorPusher";
import { useSpaData } from "@/providers/SpaDataProvider";

function breadcrumbsFor(pathname: string) {
  const base = [{ label: `Bảng điều hành`, href: "/dashboard" }];
  if (pathname.includes("/appointments"))
    return [...base, { label: `Lịch hẹn` }];
  if (pathname.includes("/customers"))
    return [...base, { label: `Khách hàng` }];
  if (pathname.includes("/workflows"))
    return [...base, { label: `Tự động hóa` }];
  if (pathname.includes("/therapists"))
    return [...base, { label: `Nhân viên` }];
  return [{ label: `Operations Center` }];
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { setPendingOnlineBookingsCount } = useSpaData() as any;

  const handleNewBooking = useCallback(() => {
    // Tăng counter booking mới chờ xử lý chỉ khi ở trang operator
    if (typeof setPendingOnlineBookingsCount === "function") {
      setPendingOnlineBookingsCount((prev: number) => prev + 1);
    }
  }, [setPendingOnlineBookingsCount]);

  // Chỉ operator mới nhận thông báo booking mới qua Pusher
  useOperatorPusher(handleNewBooking);

  return (
    <DashboardShell breadcrumbs={breadcrumbsFor(pathname)}>
      {children}
    </DashboardShell>
  );
}
