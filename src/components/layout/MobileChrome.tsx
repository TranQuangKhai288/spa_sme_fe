"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ROUTES, shouldShowMobileNav } from "@/lib/constants";

import { MobileBottomNav } from "./MobileBottomNav";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function MobileChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showChrome = shouldShowMobileNav(pathname);

  const showFab =
    pathname.startsWith("/dashboard") || pathname === ROUTES.appointments;

  return (
    <>
      <div
        className={
          showChrome
            ? "pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0"
            : ""
        }
      >
        {children}
      </div>

      {showChrome && <MobileBottomNav />}

      {showFab && (
        <Link
          href={ROUTES.appointments}
          className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-jade-green text-white shadow-lg transition-transform active:scale-90 lg:hidden"
          aria-label={`Tạo lịch hẹn`}
        >
          <MaterialIcon name="add" className="text-[28px]" />
        </Link>
      )}
    </>
  );
}
