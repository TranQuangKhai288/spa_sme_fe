"use client";

import { useState } from "react";
import Link from "next/link";
import { useSpaData } from "@/hooks/useSpaData";
import { ROUTES } from "@/lib/constants";
import { formatVnd } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SiteHeader } from "@/components/layout/SiteHeader";

const STEP_KEYS = [
  "BOOKING.STEPS.SERVICE",
  "BOOKING.STEPS.THERAPIST",
  "BOOKING.STEPS.TIME",
  "BOOKING.STEPS.CONFIRM",
];

const STEP_LABELS = ["Chọn dịch vụ", "Chọn KTV", "Chọn thời gian", "Xác nhận"];

export function BookingFlowView() {
  const { services, therapists, addAppointment } = useSpaData();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [therapistId, setTherapistId] = useState(therapists[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("14:00");
  const [done, setDone] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const service = services.find((s) => s.id === serviceId)!;
  const therapist = therapists.find((t) => t.id === therapistId)!;

  const handleConfirm = () => {
    const endHour = parseInt(time.split(":")[0], 10);
    const endMin = parseInt(time.split(":")[1], 10) + (service?.duration ?? 60);
    const endTime = `${String(endHour + Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;

    addAppointment({
      clientId: "guest",
      clientName: guestName || "Khách đặt online",
      clientTier: "Mới",
      clientAvatar: "https://i.pravatar.cc/150?img=33",
      service: service.name,
      serviceIcon: "spa",
      therapist: therapist.name,
      therapistId: therapist.id,
      startTime: time,
      endTime,
      date,
      price: service.price,
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 pt-16 text-center sm:px-6">
        <GlassCard className="w-full p-10">
          <MaterialIcon
            name="check_circle"
            className="mb-4 text-6xl text-jade-green"
            filled
          />
          <h1 className="font-headline text-2xl font-bold text-dark-slate">
            {`Đặt lịch thành công!`}
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            {`Chúng tôi đã ghi nhận lịch ${service.name} với ${therapist.name}.`}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href={ROUTES.dashboard}>
              <Button className="w-full">{`Về Dashboard`}</Button>
            </Link>
            <Link href={ROUTES.home}>
              <Button variant="ghost" className="w-full">
                {`Trang chủ`}
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader active="booking" />
      <div className="mx-auto max-w-2xl px-4 py-8 pt-20 sm:px-6 sm:py-12 sm:pt-24">
        <Link
          href={ROUTES.home}
          className="font-cta mb-6 inline-flex items-center gap-1 text-sm text-primary sm:mb-8"
        >
          <MaterialIcon name="arrow_back" className="text-[18px]" />
          ZenFlow Spa
        </Link>

        <h1 className="font-headline mb-2 text-3xl font-bold text-dark-slate">
          {`Đặt lịch trực tuyến`}
        </h1>
        <p className="mb-8 text-sm text-on-surface-variant">
          {`Bước ${step + 1}/${STEP_KEYS.length}: ${STEP_LABELS[step]}`}
        </p>

        <div className="mb-8 flex gap-2">
          {STEP_KEYS.map((key, i) => (
            <div
              key={key}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-white/50"}`}
            />
          ))}
        </div>

        <GlassCard className="p-8">
          {step === 0 && (
            <div className="space-y-3">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    serviceId === s.id
                      ? "border-primary bg-primary/5"
                      : "border-glass-border hover:bg-white/40"
                  }`}
                >
                  <p className="font-semibold text-dark-slate">{s.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {s.duration} phút • {formatVnd(s.price)}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {therapists.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTherapistId(t.id)}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    therapistId === t.id
                      ? "border-primary bg-primary/5"
                      : "border-glass-border"
                  }`}
                >
                  <img
                    src={t.avatar}
                    alt=""
                    className="mx-auto mb-2 h-16 w-16 rounded-full object-cover"
                  />
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {t.specialty}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm">
                <span className="font-cta mb-1 block">{`Ngày`}</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5"
                />
              </label>
              <label className="block text-sm">
                <span className="font-cta mb-1 block">{`Giờ bắt đầu`}</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5"
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <input
                placeholder={`Họ tên *`}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm"
              />
              <input
                placeholder={`Số điện thoại *`}
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-2.5 text-sm"
              />
              <div className="rounded-xl bg-primary/5 p-4 text-sm">
                <p>
                  <strong>{service?.name}</strong> với {therapist?.name}
                </p>
                <p className="text-on-surface-variant">
                  {date} lúc {time} — {formatVnd(service?.price ?? 0)}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              {`Quay lại`}
            </Button>
            {step < STEP_KEYS.length - 1 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                {`Tiếp tục`}
              </Button>
            ) : (
              <Button type="button" onClick={handleConfirm}>
                {`Xác nhận đặt lịch`}
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
