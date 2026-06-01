"use client";

import { useSpaData } from "@/hooks/useSpaData";
import { UnderDevelopmentView } from "@/components/dashboard/UnderDevelopmentView";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const { currentUser } = useSpaData();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-primary">Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  return (
    <UnderDevelopmentView
      title="Báo cáo & Phân tích"
      description="Hệ thống tổng hợp báo cáo doanh thu, hiệu suất Nhân viên, tỷ lệ đặt lịch và phân tích xu hướng tăng trưởng khách hàng trong tương lai."
      icon="analytics"
      completionPercentage={70}
    />
  );
}
