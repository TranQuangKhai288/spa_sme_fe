import { UnderDevelopmentView } from "@/components/dashboard/UnderDevelopmentView";

export const metadata = {
  title: "Báo cáo & Phân tích | ZenFlow Spa",
  description: "Trang tổng hợp báo cáo tài chính và hiệu suất vận hành spa",
};

export default function ReportsPage() {
  return (
    <UnderDevelopmentView
      title="Báo cáo & Phân tích"
      description="Hệ thống tổng hợp báo cáo doanh thu, hiệu suất kỹ thuật viên, tỷ lệ đặt lịch và phân tích xu hướng tăng trưởng khách hàng trong tương lai."
      icon="analytics"
      completionPercentage={70}
    />
  );
}
