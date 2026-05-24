"use client";

import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { usePathname } from "next/navigation";
import { useLocale } from "@/providers/LocaleProvider";

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

  return (
    <DashboardShell breadcrumbs={breadcrumbsFor(pathname)}>
      {children}
    </DashboardShell>
  );
}
