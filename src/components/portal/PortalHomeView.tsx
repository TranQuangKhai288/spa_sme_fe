"use client";

import Link from "next/link";
import { useSpaData } from "@/hooks/useSpaData";
import { ROUTES } from "@/lib/constants";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/providers/LocaleProvider";

export function PortalHomeView() {
  const { currentUser, appointments, treatmentProgress } = useSpaData();
  const upcoming = appointments.find((a) => a.status === "confirmed");

  return (
    <div className="space-y-8 pb-4 lg:pb-8">
      <section>
        <h1 className="font-headline text-2xl font-semibold text-on-surface sm:text-3xl">
          {currentUser.greeting}
        </h1>
        <p className="mt-1 text-on-surface-variant/80">{`Sẵn sàng cho trải nghiệm thư giãn của bạn?`}</p>
      </section>

      {upcoming ? (
        <section className="relative">
          <div className="absolute -inset-0.5 rounded-xl bg-linear-to-r from-jade-green to-soft-gold opacity-10 blur" />
          <GlassCard className="relative p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <span className="font-cta text-[10px] font-bold uppercase tracking-widest text-jade-green">
                {`Sắp tới`}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-jade-green/10 px-3 py-1 text-[10px] font-bold text-jade-green">
                <MaterialIcon name="schedule" className="text-[14px]" filled />
                1h 15m
              </span>
            </div>
            <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/150?img=25"
                alt=""
                className="h-14 w-14 rounded-full border-2 border-white/50 object-cover sm:h-16 sm:w-16"
              />
              <div>
                <h3 className="font-semibold">{upcoming.therapist}</h3>
                <p className="text-sm text-on-surface-variant">
                  {upcoming.service}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1">{`Check-in`}</Button>
              <Link href={ROUTES.booking} className="flex-1 sm:flex-none">
                <Button variant="ghost" className="w-full">
                  {`Đổi lịch`}
                </Button>
              </Link>
            </div>
          </GlassCard>
        </section>
      ) : (
        <GlassCard className="p-8 text-center">
          <MaterialIcon
            name="event_busy"
            className="mb-3 text-4xl text-on-surface-variant/40"
          />
          <p className="text-sm text-on-surface-variant">
            {`Chưa có lịch hẹn sắp tới`}
          </p>
          <Link href={ROUTES.booking} className="mt-4 inline-block">
            <Button size="sm">{`Đặt lịch ngay`}</Button>
          </Link>
        </GlassCard>
      )}

      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        <GlassCard
          className="flex h-28 flex-col justify-between p-4 sm:h-32"
          hover
        >
          <MaterialIcon name="spa" className="text-soft-gold" filled />
          <span className="font-cta text-sm">{`Buổi mới`}</span>
        </GlassCard>
        <GlassCard
          className="flex h-28 flex-col justify-between p-4 sm:h-32"
          hover
        >
          <MaterialIcon name="history" className="text-jade-green" />
          <span className="font-cta text-sm">{`Lịch sử của tôi`}</span>
        </GlassCard>
        <GlassCard
          className="col-span-2 flex items-center justify-between p-4 sm:p-5"
          hover
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-secondary-container p-3">
              <MaterialIcon name="card_giftcard" />
            </div>
            <div>
              <p className="font-semibold">{`Quà thành viên`}</p>
              <p className="text-xs text-on-surface-variant">
                {`250 điểm đến ngày spa tiếp theo`}
              </p>
            </div>
          </div>
          <MaterialIcon name="chevron_right" />
        </GlassCard>
      </section>

      {treatmentProgress[0] && (
        <section>
          <Link
            href={ROUTES.portalTreatments}
            className="mb-3 flex items-center justify-between"
          >
            <h2 className="font-headline text-lg font-semibold">
              {`Tiến độ liệu trình`}
            </h2>
            <span className="text-xs font-bold text-jade-green">
              {`Xem tất cả`}
            </span>
          </Link>
          <GlassCard className="p-4">
            <p className="text-sm font-semibold">
              {treatmentProgress[0].packageName}
            </p>
            <p className="text-xs text-on-surface-variant">
              {treatmentProgress[0].completedSessions}/
              {treatmentProgress[0].totalSessions} buổi
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-jade-green"
                style={{
                  width: `${(treatmentProgress[0].completedSessions / treatmentProgress[0].totalSessions) * 100}%`,
                }}
              />
            </div>
          </GlassCard>
        </section>
      )}
    </div>
  );
}
