import { UnderDevelopmentView } from "@/components/dashboard/UnderDevelopmentView";

export const metadata = {
  title: "Quản lý Dịch vụ | ZenFlow Spa",
  description: "Trang thiết lập danh mục dịch vụ spa",
};

export default function ServicesPage() {
  return (
    <UnderDevelopmentView
      title="Thiết lập Dịch vụ"
      description="Nơi quản lý danh mục liệu trình, dịch vụ spa, cài đặt thời gian liệu trình và định giá dịch vụ. Chúng tôi đang tích cực hoàn thiện tính năng này."
      icon="spa"
      completionPercentage={85}
    />
  );
}
