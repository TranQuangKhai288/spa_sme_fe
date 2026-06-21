import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function DefaultLanding() {
  return (
    <div className="min-h-screen">
      <SiteHeader active="home" />

      <section className="flex min-h-[85vh] flex-col items-center justify-center px-4 pt-20 text-center sm:min-h-screen sm:px-6 sm:pt-24 md:px-12">
        <p className="font-cta mb-4 text-xs font-bold uppercase tracking-[0.2em] text-jade-green">
          {`Dịch vụ chăm sóc sức khỏe cao cấp`}
        </p>
        <h1 className="font-headline max-w-4xl text-3xl font-bold leading-tight text-dark-slate sm:text-4xl md:text-6xl">
          {`Trải nghiệm spa cao cấp với vận hành thông minh`}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-on-surface-variant sm:mt-6 sm:text-lg">
          {`ZenFlow — website responsive trên mọi thiết bị: dashboard vận hành, cổng khách hàng và đặt lịch trực tuyến.`}
        </p>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Link href={ROUTES.dashboard} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full"
              icon={<MaterialIcon name="dashboard" />}
            >
              {`Mở Dashboard`}
            </Button>
          </Link>
          <Link href={ROUTES.booking} className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full">
              {`Đặt lịch online`}
            </Button>
          </Link>
        </div>
      </section>

      <section
        id="services"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-12 md:py-20"
      >
        <h2 className="font-headline mb-8 text-center text-2xl font-bold sm:mb-12 sm:text-3xl">
          Hệ sinh thái ZenFlow
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {[
            {
              icon: "dashboard",
              title: "Hoạt động hàng ngày",
              desc: "Dashboard responsive: thống kê, lịch hẹn, liệu trình, tự động hóa.",
            },
            {
              icon: "calendar_month",
              title: "Quy trình đặt lịch",
              desc: "Đặt lịch 4 bước — tối ưu trên mobile và desktop.",
            },
            {
              icon: "calendar_month",
              title: "Đặt lịch & vận hành",
              desc: "Luồng đặt lịch và dashboard — bottom nav trùng sidebar trên mobile.",
            },
          ].map((item) => (
            <GlassCard key={item.title} className="p-6 sm:p-8" hover>
              <MaterialIcon
                name={item.icon}
                className="mb-4 text-3xl text-jade-green sm:text-4xl"
              />
              <h3 className="font-headline text-lg font-semibold sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-on-surface-variant">
                {item.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="border-t border-glass-border bg-milky-white/50 py-12 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-12">
          <div>
            <h2 className="font-headline text-xl font-bold sm:text-2xl">
              Hệ thống thiết kế
            </h2>
            <p className="mt-2 max-w-md text-sm text-on-surface-variant">
              Jade • Milky White • Soft Gold • Glass blur 20px
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={ROUTES.dashboard}>
              <Button className="w-full sm:w-auto">{`Portal vận hành`}</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-glass-border px-4 py-8 text-center text-xs text-on-surface-variant sm:px-6 md:px-12">
        {`ZenFlow Spa v2.4 • Hỗ trợ • Chính sách • Liên hệ IT`}
      </footer>
    </div>
  );
}
