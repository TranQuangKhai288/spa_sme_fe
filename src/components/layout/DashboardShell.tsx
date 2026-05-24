"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { CreateAppointmentModal } from "@/components/dashboard/CreateAppointmentModal";

export interface DashboardShellProps {
  children: ReactNode;
  breadcrumbs: { label: string; href?: string }[];
  showCreateButton?: boolean;
}

export function DashboardShell({
  children,
  breadcrumbs,
  showCreateButton = true,
}: DashboardShellProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <DashboardHeader
        breadcrumbs={breadcrumbs}
        onMenuOpen={() => setSidebarOpen(true)}
        onCreateAppointment={
          showCreateButton ? () => setModalOpen(true) : undefined
        }
      />
      <main className="min-h-screen pt-16 sm:pt-20 lg:ml-64">
        <div className="px-4 sm:px-6 lg:px-8 lg:pb-10">{children}</div>
      </main>
      {modalOpen && (
        <CreateAppointmentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
