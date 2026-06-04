"use client";

import { TherapistDetailView } from "@/components/dashboard/TherapistDetailView";
import { Suspense } from "react";

export default function TherapistDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-primary">Đang tải thông tin nhân viên...</div>}>
      <TherapistDetailView />
    </Suspense>
  );
}
