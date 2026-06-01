"use client";

import { useSpaData } from "@/hooks/useSpaData";
import { UnderDevelopmentView } from "@/components/dashboard/UnderDevelopmentView";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const { currentUser } = useSpaData();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && currentUser.role === "technician") {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role === "technician") {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-primary">Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  return (
    <UnderDevelopmentView
      title="Thiết lập Dịch vụ"
      description="Nơi quản lý danh mục liệu trình, dịch vụ spa, cài đặt thời gian liệu trình và định giá dịch vụ. Chúng tôi đang tích cực hoàn thiện tính năng này."
      icon="spa"
      completionPercentage={85}
    />
  );
}
