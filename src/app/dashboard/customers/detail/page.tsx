"use client";

import { CustomerDetailView } from "@/components/dashboard/CustomerDetailView";
import { Suspense } from "react";

export default function CustomerDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-primary">Đang tải thông tin khách hàng...</div>}>
      <CustomerDetailView />
    </Suspense>
  );
}
