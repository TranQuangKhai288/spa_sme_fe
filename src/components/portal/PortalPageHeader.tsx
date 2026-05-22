"use client";

import { useSpaData } from "@/hooks/useSpaData";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function PortalPageHeader() {
  const { currentUser } = useSpaData();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-glass-border bg-glass-bg px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-3">
        <img
          src={currentUser.avatar}
          alt=""
          className="h-10 w-10 rounded-full border-2 border-jade-green object-cover"
        />
        <span className="font-headline text-lg font-semibold text-primary">
          ZenFlow
        </span>
      </div>
      <button
        type="button"
        className="rounded-full p-2 text-primary"
        aria-label="Cài đặt"
      >
        <MaterialIcon name="settings" />
      </button>
    </header>
  );
}
