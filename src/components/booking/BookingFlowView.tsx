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
import { showToast } from "@/components/ui/Toast";

const STEP_LABELS = ["Chọn dịch vụ", "Chọn KTV", "Chọn thời gian", "Xác nhận"];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30",
];

// Simulate some slots being taken
const TAKEN_SLOTS = ["10:00", "11:00", "14:30", "16:00"];

export function BookingFlowView() {
  const { services, therapists, addAppointment } = useSpaData();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [therapistId, setTherapistId] = useState(therapists[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestNote, setGuestNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const service = services.find((s) => s.id === serviceId)!;
  const therapist = therapists.find((t) => t.id === therapistId)!;

  const validate = () => {
    if (step === 2 && !time) {
      setErrors({ time: "Vui lòng chọn giờ bắt đầu" });
      return false;
    }
    if (step === 3) {
      const newErrors: Record<string, string> = {};
      if (!guestName.trim()) newErrors.name = "Vui lòng nhập họ tên";
      if (!guestPhone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
      if (guestPhone && !/^0[0-9]{9}$/.test(guestPhone.trim())) {
        newErrors.phone = "Số điện thoại không hợp lệ";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    setStep((s) => s + 1);
  };

  const handleConfirm = () => {
    if (!validate()) return;
    const [h, m] = time.split(":").map(Number);
    const totalMinutes = m + (service?.duration ?? 60);
    const endTime = `${String(h + Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;

    addAppointment({
      clientId: "guest",
      clientName: guestName || "Khách đặt online",
      clientTier: "Mới",
      clientAvatar: `https://i.pravatar.cc/150?u=${guestPhone}`,
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
        <GlassCard className="w-full p-10 rounded-3xl">
          <div className="w-20 h-20 rounded-full bg-jade-green/10 flex items-center justify-center mx-auto mb-6">
            <MaterialIcon
              name="check_circle"
              className="text-6xl text-jade-green"
              filled
            />
          </div>
          <h1 className="font-headline text-2xl font-bold text-dark-slate">
            Đặt lịch thành công! 🎉
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Chúng tôi đã ghi nhận lịch <strong>{service.name}</strong> với KTV <strong>{therapist.name}</strong>.
          </p>
          <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Khách hàng:</span>
              <span className="font-semibold">{guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Ngày:</span>
              <span className="font-semibold">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Giờ:</span>
              <span className="font-semibold">{time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Phí dịch vụ:</span>
              <span className="font-bold text-primary">{formatVnd(service.price)}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-on-surface-variant/60">
            Chúng tôi sẽ gửi SMS xác nhận đến <strong>{guestPhone}</strong> trong vài phút.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href={ROUTES.dashboard}>
              <Button className="w-full">Về Dashboard</Button>
            </Link>
            <Button variant="ghost" className="w-full" onClick={() => {
              setDone(false); setStep(0); setGuestName(""); setGuestPhone(""); setTime(""); setGuestNote("");
            }}>
              Đặt lịch khác
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader active="booking" />
      <div className="mx-auto max-w-2xl px-4 py-8 pt-24 sm:px-6 sm:py-12 sm:pt-28">
        <Link
          href={ROUTES.home}
          className="font-cta mb-6 inline-flex items-center gap-1 text-sm text-primary sm:mb-8"
        >
          <MaterialIcon name="arrow_back" className="text-[18px]" />
          ZenFlow Spa
        </Link>

        <h1 className="font-headline mb-1 text-3xl font-bold text-dark-slate">
          Đặt lịch trực tuyến
        </h1>
        <p className="mb-8 text-sm text-on-surface-variant">
          Bước {step + 1}/{STEP_LABELS.length}: <span className="font-medium text-dark-slate">{STEP_LABELS[step]}</span>
        </p>

        {/* Progress bar */}
        <div className="mb-8 flex gap-2">
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-white/50 border border-glass-border"}`}
            />
          ))}
        </div>

        <GlassCard className="p-6 sm:p-8 rounded-3xl">
          {/* Step 0: Service Selection */}
          {step === 0 && (
            <div className="space-y-3">
              <h2 className="font-headline text-lg font-bold text-dark-slate mb-4">Chọn dịch vụ</h2>
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    serviceId === s.id
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                      : "border-glass-border hover:bg-white/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${serviceId === s.id ? "bg-primary/15" : "bg-white/50"}`}>
                        <MaterialIcon name="spa" className={`text-[20px] ${serviceId === s.id ? "text-primary" : "text-on-surface-variant"}`} />
                      </div>
                      <div>
                        <p className="font-bold text-dark-slate">{s.name}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{s.description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary">{formatVnd(s.price)}</p>
                      <p className="text-xs text-on-surface-variant">{s.duration} phút</p>
                    </div>
                  </div>
                  {s.popular && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-soft-gold/10 text-soft-gold rounded-full px-2 py-0.5 text-[10px] font-bold">
                      <MaterialIcon name="star" className="text-[12px]" filled />
                      Phổ biến nhất
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Therapist Selection */}
          {step === 1 && (
            <div>
              <h2 className="font-headline text-lg font-bold text-dark-slate mb-4">Chọn kỹ thuật viên</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {therapists.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTherapistId(t.id)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      therapistId === t.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-glass-border hover:bg-white/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={t.avatar}
                        alt=""
                        className="h-14 w-14 rounded-full object-cover border-2 border-primary/10"
                      />
                      <div>
                        <p className="font-bold text-dark-slate">{t.name}</p>
                        <p className="text-xs text-on-surface-variant">{t.specialty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MaterialIcon name="star" className="text-soft-gold text-[13px]" filled />
                          <span className="text-xs font-bold text-soft-gold">{t.rating}</span>
                          <span className="text-xs text-on-surface-variant/60">({t.totalReviews})</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant/80 leading-relaxed">{t.bio}</p>
                    <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      t.availability === "available" ? "bg-jade-green/10 text-jade-green" : "bg-red-500/10 text-red-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.availability === "available" ? "bg-jade-green" : "bg-red-400"}`} />
                      {t.availability === "available" ? "Sẵn sàng" : "Đang bận"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Slots */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-headline text-lg font-bold text-dark-slate">Chọn ngày & giờ</h2>

              {/* Date picker */}
              <label className="block">
                <span className="font-cta mb-1.5 block text-sm font-medium text-on-surface-variant">Ngày hẹn</span>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-3 text-sm focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none"
                />
              </label>

              {/* Time slot grid */}
              <div>
                <span className="font-cta mb-3 block text-sm font-medium text-on-surface-variant">Chọn giờ bắt đầu</span>
                {errors.time && (
                  <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                    <MaterialIcon name="error" className="text-[14px]" />
                    {errors.time}
                  </p>
                )}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isTaken = TAKEN_SLOTS.includes(slot);
                    const isSelected = time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isTaken}
                        onClick={() => { setTime(slot); setErrors({}); }}
                        className={`rounded-xl py-2.5 text-sm font-medium transition-all ${
                          isTaken
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed line-through"
                            : isSelected
                              ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                              : "bg-white/60 border border-glass-border text-dark-slate hover:border-primary/30 hover:bg-primary/5"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-3 text-[11px] text-on-surface-variant/60">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-primary inline-block" /> Đã chọn
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-gray-200 inline-block" /> Đã có người đặt
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm & Guest Info */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-headline text-lg font-bold text-dark-slate mb-4">Xác nhận thông tin</h2>

              {/* Summary box */}
              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 space-y-2.5 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Dịch vụ</span>
                  <span className="text-sm font-bold text-dark-slate">{service?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Kỹ thuật viên</span>
                  <div className="flex items-center gap-2">
                    <img src={therapist?.avatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-semibold">{therapist?.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Ngày & Giờ</span>
                  <span className="text-sm font-semibold">{date} lúc {time}</span>
                </div>
                <div className="flex items-center justify-between border-t border-primary/10 pt-2.5">
                  <span className="text-xs font-bold text-on-surface-variant">Tổng phí</span>
                  <span className="text-base font-black text-primary">{formatVnd(service?.price ?? 0)}</span>
                </div>
              </div>

              {/* Guest info */}
              <div className="space-y-3">
                <label className="block">
                  <span className="font-cta mb-1 block text-sm text-on-surface-variant">Họ tên *</span>
                  <input
                    placeholder="Nguyễn Văn A"
                    value={guestName}
                    onChange={(e) => { setGuestName(e.target.value); setErrors((prev) => ({ ...prev, name: "" })); }}
                    className={`w-full rounded-xl border px-4 py-3 text-sm bg-white/50 outline-none transition-all ${errors.name ? "border-red-400 focus:ring-red-400/20" : "border-glass-border focus:border-primary/40"}`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </label>
                <label className="block">
                  <span className="font-cta mb-1 block text-sm text-on-surface-variant">Số điện thoại *</span>
                  <input
                    placeholder="0901234567"
                    value={guestPhone}
                    onChange={(e) => { setGuestPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: "" })); }}
                    type="tel"
                    className={`w-full rounded-xl border px-4 py-3 text-sm bg-white/50 outline-none transition-all ${errors.phone ? "border-red-400" : "border-glass-border focus:border-primary/40"}`}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </label>
                <label className="block">
                  <span className="font-cta mb-1 block text-sm text-on-surface-variant">Ghi chú thêm (tuỳ chọn)</span>
                  <textarea
                    placeholder="Dị ứng, yêu cầu đặc biệt..."
                    value={guestNote}
                    onChange={(e) => setGuestNote(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-glass-border bg-white/50 px-4 py-3 text-sm outline-none focus:border-primary/40 resize-none"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 0}
              onClick={() => { setStep((s) => s - 1); setErrors({}); }}
            >
              Quay lại
            </Button>
            {step < STEP_LABELS.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Tiếp tục
                <MaterialIcon name="arrow_forward" className="text-[18px] ml-1" />
              </Button>
            ) : (
              <Button type="button" onClick={handleConfirm}>
                Xác nhận đặt lịch
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
