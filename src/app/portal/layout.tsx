import { PortalPageHeader } from "@/components/portal/PortalPageHeader";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-milky-white">
      <PortalPageHeader />
      <div className="hidden lg:block">
        <SiteHeader active="portal" />
      </div>
      <div className="mx-auto max-w-lg px-4 pt-16 lg:max-w-4xl lg:px-8 lg:pt-24">
        {children}
      </div>
    </div>
  );
}
