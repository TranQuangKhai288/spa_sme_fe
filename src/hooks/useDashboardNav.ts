"use client";

import { DASHBOARD_NAV, type DashboardNavId } from "@/lib/constants";

export function useDashboardNav(short = false) {
  return DASHBOARD_NAV.map((item) => ({
    ...item,
    label: short ? (item.shortLabel ?? item.label) : item.label,
  }));
}

export type DashboardNavItem = ReturnType<typeof useDashboardNav>[number];
export type { DashboardNavId };
