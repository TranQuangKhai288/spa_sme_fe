export const ROUTES = {
  home: "/",
  booking: "/booking",
  portal: "/portal",
  portalAppointments: "/portal/appointments",
  portalTreatments: "/portal/treatments",
  portalNotifications: "/portal/notifications",
  portalProfile: "/portal/profile",
  dashboard: "/dashboard",
  appointments: "/dashboard/appointments",
  customers: "/dashboard/customers",
  workflows: "/dashboard/workflows",
  services: "/dashboard/services",
  reports: "/dashboard/reports",
} as const;

export type DashboardNavId =
  | "dashboard"
  | "appointments"
  | "services"
  | "customers"
  | "reports"
  | "workflows";

export const DASHBOARD_NAV: {
  id: DashboardNavId;
  label: string;
  shortLabel?: string;
  icon: string;
  href: string;
}[] = [
  {
    id: "dashboard",
    label: "Bảng điều hành",
    shortLabel: "Tổng quan",
    icon: "dashboard",
    href: ROUTES.dashboard,
  },
  {
    id: "appointments",
    label: "Lịch hẹn",
    shortLabel: "Lịch",
    icon: "calendar_month",
    href: ROUTES.appointments,
  },
  {
    id: "services",
    label: "Dịch vụ",
    shortLabel: "DV",
    icon: "spa",
    href: ROUTES.services,
  },
  {
    id: "customers",
    label: "Khách hàng",
    shortLabel: "KH",
    icon: "person_search",
    href: ROUTES.customers,
  },
  {
    id: "reports",
    label: "Báo cáo",
    shortLabel: "BCTC",
    icon: "analytics",
    href: ROUTES.reports,
  },
  {
    id: "workflows",
    label: "Tự động hóa",
    shortLabel: "Automation",
    icon: "bolt",
    href: ROUTES.workflows,
  },
];

/** Mobile bottom nav = cùng tab với sidebar (một nguồn DASHBOARD_NAV) */
export type MobileNavItem = (typeof DASHBOARD_NAV)[number];

export const MOBILE_BOTTOM_NAV: MobileNavItem[] = DASHBOARD_NAV;

/** Trang dùng layout mobile (bottom nav giống sidebar) */
export function shouldShowMobileNav(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/portal") ||
    pathname === "/booking" ||
    pathname === "/"
  );
}

export function activeMobileNavId(
  pathname: string,
  items: MobileNavItem[] = MOBILE_BOTTOM_NAV,
): DashboardNavId {
  const exact = items.find((item) => pathname === item.href);
  if (exact) return exact.id;

  const byPrefix = items
    .filter(
      (item) => item.href.length > 1 && pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
  if (byPrefix) return byPrefix.id;

  return "dashboard";
}
