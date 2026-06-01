"use client";

import { useSpaData } from "@/hooks/useSpaData";
import { WorkflowsView } from "@/components/dashboard/WorkflowsView";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkflowsPage() {
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

  return <WorkflowsView />;
}
