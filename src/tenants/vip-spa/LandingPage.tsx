"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { BookingModal } from "@/components/landing/BookingModal";
import { DraggableAssistiveButton } from "@/components/ui/DraggableAssistiveButton";

const NAV_LINKS = [
  { label: "Sanctuary", href: "#", isActive: true },
  { label: "Treatments", href: "#treatments" },
  { label: "Rituals", href: "#rituals" },
];

const PHILOSOPHY_FEATURES = [
  {
    icon: "spa",
    title: "Nguyên liệu thuần khiết",
    desc: "100% thảo mộc hữu cơ được tuyển chọn tinh tế.",
    delay: "0.4s",
  },
  {
    icon: "water_drop",
    title: "Nghệ thuật trị liệu",
    desc: "Sự kết hợp giữa y học cổ truyền và kỹ thuật hiện đại.",
    delay: "0.5s",
  },
];

const SERVICES = [
  {
    title: "Trị Liệu Massage",
    desc: "Phục hồi năng lượng sâu từ bên trong.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDehOlPSsEr3Tjro0Op1tP8Aohtt5OxtAB_suIdn7tJbEqNabPerKQL0BUzskhJbbtpu6Kp79EXD_vtOv_AtkFSCulqdWleXs1LkLLoJ2o7LXAyHvA82TSYS4lTiTkPEunrSrnR0QYaiecHTYJQDE50yjjC3rSHWJ7bYCQp38x5XnXtlmB0m9pxi1-otXf8T0a-tWymKUx5lI8w22mx8W2VA2LPLhzwGSYyTISW-uUGn9ZvHaRq5_H3xAn8qSKySuN36Rf1y5WWPSA",
    delay: "0s",
  },
  {
    title: "Chăm Sóc Da Mặt",
    desc: "Đánh thức vẻ rạng rỡ tự nhiên của làn da.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDehOlPSsEr3Tjro0Op1tP8Aohtt5OxtAB_suIdn7tJbEqNabPerKQL0BUzskhJbbtpu6Kp79EXD_vtOv_AtkFSCulqdWleXs1LkLLoJ2o7LXAyHvA82TSYS4lTiTkPEunrSrnR0QYaiecHTYJQDE50yjjC3rSHWJ7bYCQp38x5XnXtlmB0m9pxi1-otXf8T0a-tWymKUx5lI8w22mx8W2VA2LPLhzwGSYyTISW-uUGn9ZvHaRq5_H3xAn8qSKySuN36Rf1y5WWPSA",
    delay: "0.1s",
  },
  {
    title: "Chăm Sóc Thể Chất",
    desc: "Sự tỉ mỉ trong từng chi tiết nhỏ nhất.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDehOlPSsEr3Tjro0Op1tP8Aohtt5OxtAB_suIdn7tJbEqNabPerKQL0BUzskhJbbtpu6Kp79EXD_vtOv_AtkFSCulqdWleXs1LkLLoJ2o7LXAyHvA82TSYS4lTiTkPEunrSrnR0QYaiecHTYJQDE50yjjC3rSHWJ7bYCQp38x5XnXtlmB0m9pxi1-otXf8T0a-tWymKUx5lI8w22mx8W2VA2LPLhzwGSYyTISW-uUGn9ZvHaRq5_H3xAn8qSKySuN36Rf1y5WWPSA",
    delay: "0.2s",
  },
];

const FOOTER_LINKS_DISCOVER = [
  { label: "Sanctuary", href: "#" },
  { label: "Treatments", href: "#" },
  { label: "Rituals", href: "#" },
];

const FOOTER_LINKS_SUPPORT = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact Us", href: "#" },
];

const FOOTER_CONTACTS = [
  { icon: "location_on", text: "123 Đường Tĩnh Lặng, Quận 1, TP. HCM" },
  { icon: "call", text: "+84 123 456 789" },
];

export default function VIPLandingPage() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-in-up, .fade-in-right, .fade-in-left, .fade-in-scale");
    elements.forEach((el) => {
      observer.observe(el);
    });

    // Trigger animation for elements already in view on load
    setTimeout(() => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add("visible");
        }
      });
    }, 100);

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="bg-warm-ivory text-on-surface antialiased overflow-x-hidden min-h-screen">
      <BookingModal open={showBookingModal} onClose={() => setShowBookingModal(false)} />
      {/* Navigation */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-500 ease-in-out bg-white/70 backdrop-blur-xl border-b border-glass-border"
        id="navbar"
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="font-headline-sm text-headline-sm tracking-widest text-on-surface">
            SERENITY SPA
          </div>
          <div className="hidden md:flex gap-8 items-center">
            {NAV_LINKS.map((link, idx) => (
              <Link
                key={idx}
                className={`font-label-md text-label-md transition-colors duration-300 ${link.isActive
                  ? "text-champagne-gold font-bold border-b-2 border-champagne-gold pb-1"
                  : "text-on-surface-variant font-medium hover:text-champagne-gold"
                  }`}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href={ROUTES.dashboard} className="font-label-md text-label-md text-charcoal-black border border-outline px-6 py-3 rounded-full hover:bg-surface-container-high transition-colors duration-300">
              Cổng vận hành
            </Link>
            <button onClick={() => setShowBookingModal(true)} className="bg-champagne-gold text-charcoal-black font-label-md text-label-md px-6 py-3 rounded-full hover:bg-primary-fixed transition-colors duration-300">
              Đặt lịch ngay
            </button>
          </div>
          <button className="md:hidden text-on-surface">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-surface">
        {/* Background Image with Horizontal Gradient Mask */}
        <div className="absolute inset-0 z-0 flex">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-surface/30 to-surface/80 z-10"></div>
          <img
            alt="Spa Treatment"
            className="w-full h-full object-cover animate-kenburns origin-center"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJpH9YM5Gwswd1wlZfpKzcL75acrNQHQzOF1PJiAU9oCt-h6YKcgxA03ekDTLCrWD2xj0L7IE4xbXHp4vM2bSKWH_o8Fmrk_028GLG1MrjnoaKlX8wT2l0W5RZu3Kiuta-Tbot5jZK-RU7ETxckspDjmmQb1hDP3JBylpn460dVHiViUq65jb8-PwevAyz746sI4TQz1_qUtBhwxkH5oA73dCdHWp5V59KO2sDghEMwMmawVbhQqXxqcvj12c3lAqusV1Mkgrz3Yc"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10 h-1/2 mt-auto"></div>
        </div>
        <div className="relative z-20 container mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            {/* Left Side: Content */}
            <div className="fade-in-right">
              <span className="font-label-md text-label-md text-champagne-gold tracking-widest mb-4 block uppercase">
                Trải nghiệm thượng lưu
              </span>
              <h1 className="font-display-lg text-5xl md:text-[80px] text-charcoal-black mb-6 leading-tight">
                Thánh Đường
                <br />
                Thư Giãn
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-lg">
                Khám phá không gian trị liệu đẳng cấp, nơi nghệ thuật chăm sóc cơ thể hòa quyện cùng sự tĩnh lặng tuyệt đối.
              </p>
              <div className="flex flex-wrap gap-4 mt-8 fade-in-right" style={{ transitionDelay: "0.2s" }}>
                <button onClick={() => setShowBookingModal(true)} className="inline-flex items-center justify-center bg-champagne-gold text-charcoal-black font-label-md text-label-md px-10 py-4 rounded-full hover:bg-primary-fixed transition-all duration-300 shadow-lg uppercase tracking-widest min-w-[200px]">
                  Đặt lịch ngay
                </button>
                <Link href="#treatments" className="inline-flex items-center justify-center border border-charcoal-black text-charcoal-black font-label-md text-label-md px-10 py-4 rounded-full hover:bg-charcoal-black hover:text-warm-ivory transition-all duration-300 uppercase tracking-widest min-w-[200px]">
                  Khám phá
                </Link>
              </div>
            </div>
            {/* Right Side: Visual Focus */}
            <div className="mt-12 md:mt-0 h-full">
              <div className="relative h-full flex items-center justify-center">
                <div className="relative w-full max-w-lg h-[350px] md:h-[500px]">
                  {/* Main Editorial Image */}
                  <div className="absolute top-0 right-0 w-4/5 h-4/5 organic-blob overflow-hidden shadow-2xl border-8 border-warm-ivory z-10 fade-in-left">
                    <img
                      alt="Spa Treatment"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDehOlPSsEr3Tjro0Op1tP8Aohtt5OxtAB_suIdn7tJbEqNabPerKQL0BUzskhJbbtpu6Kp79EXD_vtOv_AtkFSCulqdWleXs1LkLLoJ2o7LXAyHvA82TSYS4lTiTkPEunrSrnR0QYaiecHTYJQDE50yjjC3rSHWJ7bYCQp38x5XnXtlmB0m9pxi1-otXf8T0a-tWymKUx5lI8w22mx8W2VA2LPLhzwGSYyTISW-uUGn9ZvHaRq5_H3xAn8qSKySuN36Rf1y5WWPSA"
                    />
                  </div>
                  {/* Accent Editorial Image */}
                  <div className="absolute bottom-0 left-0 w-1/2 h-1/2 organic-blob-2 overflow-hidden shadow-xl border-8 border-warm-ivory z-20 fade-in-right" style={{ transitionDelay: "0.15s" }}>
                    <img
                      alt="Wellness Ritual"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGdd8hSbxnFKG9i1-D4IlI2dWv3lpOVH-WIBIOwKcJ3DvWUTZVurh84rBkmitz9g6EP3n4DuNME7mAAJXAOq_KksmJhAHo7rQLXqtrLPMSxXAHOMzFizAv4Z60DOxDhXlehwyUgVNrEiABinAG2IpLlhKm_NzMCPkoNMKDny16VdD4FM3EXhDtHq2CJUPWiaCsOuj3H7b__A3MvpukKzmJmAADDK6cPn-RpTSqqSOuauZJYuzRgVOq5UezJFFTzWEL65aTX7YezJs"
                    />
                  </div>
                  {/* Decorative Element */}
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-radial from-champagne-gold/20 to-transparent opacity-50 blur-md z-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Element */}
        <div className="absolute left-margin-desktop hidden md:block z-20 bottom-32">
          <div className="flex items-center gap-4 text-outline">
            <div className="w-12 h-px bg-outline"></div>
            <span className="font-label-md text-label-md uppercase tracking-widest">
              ZenFlow Philosophy
            </span>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-stack-lg relative" id="philosophy">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-radial from-champagne-gold/10 to-transparent opacity-50 pointer-events-none"></div>
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md items-center">
            {/* Left: Layered Images */}
            <div className="relative h-[350px] md:h-[600px] fade-in-right order-2 md:order-1 mt-8 md:mt-0">
              <div className="absolute top-0 md:top-10 left-0 w-3/4 h-3/4 organic-blob-2 overflow-hidden shadow-2xl">
                <img
                  alt="Spa Interior"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZaxqmeH_nCO7Vt9HRqlL4MkI6PPUR7NofNpeNKwjdyrzubiIkWq-qfnpivQsQouZRRjfT2XvI-wcwBHM8TdWTE7hmWjW6rSNUtyi-Pz76AWQOVRSUjlNAsUrNMS_Kc8e85SpCWK3boWa91PI7-iWmQOXzU82g3D2rC0Pq9AVqJjukpKdSxOWFhC1PXBpFoXbJX4qjmy6tudkozY8Q25aDe7SGyNSz5N_I7aMTrCU0wrL0WyYvCI1LXEMPR82IKfNbdADV-HsxtXA"
                />
              </div>
              <div className="absolute bottom-0 right-10 w-1/2 h-1/2 rounded-full overflow-hidden border-8 border-warm-ivory shadow-lg z-10">
                <img
                  alt="Botanicals detail"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFj3lk1UECrzoXr_bM0dbLNV4flGDlPXLtp632KrI2WwbSgSIk_CZizQjNOCAk5se4qqrl54ctsENZxseCoNxbaoqwk4OcBknK7kCXQEmVO3z2reVPGIPBD-yDBFItvuSDzsRtDR0bsZbZNotI6I4NvjCOV1W6GvNa3c-MvqlvhCIadkdcIR1bYIY-SJ_79HoVnyrn3AJDQsQ46LFlxbfYUYb2HQkIvG3fPO3JSSmh9xgd6pVyroebmljyNDRmDYh6QVLarlr3bQ0"
                />
              </div>
              {/* Decorative Arc */}
              <svg
                className="absolute -left-10 top-1/2 w-32 h-32 text-champagne-gold opacity-30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 100 100"
              >
                <path d="M 0 100 A 100 100 0 0 1 100 0"></path>
              </svg>
            </div>
            {/* Right: Content */}
            <div className="fade-in-left order-1 md:order-2" style={{ transitionDelay: "0.2s" }}>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-charcoal-black mb-6">
                Triết lý của sự tĩnh lặng
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                Tại ZenFlow, chúng tôi tin rằng sự sang trọng đích thực nằm ở không gian của sự tĩnh lặng. Giữa nhịp sống ồn ào, đây là nơi bạn tìm lại nhịp điệu tự nhiên của cơ thể và tâm hồn.
              </p>
              <ul className="space-y-6">
                {PHILOSOPHY_FEATURES.map((feature, idx) => (
                  <li key={idx} className="flex items-start fade-in-left" style={{ transitionDelay: feature.delay }}>
                    <MaterialIcon name={feature.icon} className="text-champagne-gold mr-4 mt-1" />
                    <div>
                      <h3 className="font-body-lg text-body-lg font-semibold text-charcoal-black">
                        {feature.title}
                      </h3>
                      <p className="font-body-md text-body-md text-outline">
                        {feature.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-stack-lg bg-surface-container-low relative overflow-hidden" id="treatments">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-container-max relative z-10">
          <div className="text-center mb-stack-md fade-in-up">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-charcoal-black mb-4">
              Hành Trình Chăm Sóc
            </h2>
            <div className="w-24 h-px bg-champagne-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {SERVICES.map((service, idx) => (
              <div
                key={idx}
                className="group relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden fade-in-up"
                style={service.delay !== "0s" ? { transitionDelay: service.delay } : undefined}
              >
                <img
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={service.img}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/80 via-charcoal-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <h3 className="font-headline-sm text-headline-sm text-white mb-1">
                    {service.title}
                  </h3>
                  <p className="text-white font-body-sm text-body-sm text-inverse-on-surface mb-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-4 group-hover:translate-y-0">
                    {service.desc}
                  </p>
                  <button onClick={() => setShowBookingModal(true)} className="font-label-md text-label-md text-champagne-gold border border-champagne-gold px-6 py-2 rounded-full hover:bg-champagne-gold hover:text-charcoal-black transition-colors duration-300">
                    Xem thêm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-stack-lg flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="CTA Background"
            className="w-full h-full object-cover filter blur-md animate-kenburns origin-center"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj2nJpy1H9stLak9r2CtatA9Y8W09gBqBrpV9erX6szvH0JJ5QC251nNVaPbssOsi6N5x1oVGUj2pS1mipk_UHmFlb-EATujAVOeOZbbVdh-qC2jhkSWt1cTTJXxZEbr6V2MxvA5IWw1AzJU6P3ocCJuFBrxagMRvMh2lCFaogT49qexah8IGzQNNDaA_z7p8DTrI5G9BHUSfS9rpkCccxTQ6ZRhJpCFzU1C8TeAVGOMSdLv9zfTVKuTdjI4_sIGC1k85P43cCwd8"
          />
          <div className="absolute inset-0 bg-charcoal-black/60 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 text-center px-margin-mobile glass-panel rounded-3xl p-12 max-w-3xl mx-auto fade-in-scale w-11/12 md:w-auto">
          <h2 className="font-headline-lg text-4xl md:text-headline-lg text-white mb-6">
            Sẵn sàng cho sự khởi đầu mới?
          </h2>
          <p className="font-body-lg text-body-lg text-inverse-on-surface mb-8 text-white">
            Hãy để chúng tôi chăm sóc bạn, ngay hôm nay.
          </p>
          <button onClick={() => setShowBookingModal(true)} className="inline-block bg-champagne-gold text-charcoal-black font-label-md text-label-md px-10 py-4 rounded-full hover:bg-primary-fixed transition-colors duration-300 shadow-lg">
            Đặt lịch online ngay
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-stack-lg bg-surface border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop max-w-container-max mx-auto">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="font-headline-md text-headline-md text-primary mb-4">
              SERENITY SPA
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
              Thánh đường của sự tĩnh lặng và tái tạo.
            </p>
            <div className="flex gap-4">
              <svg className="w-6 h-6 text-outline hover:text-champagne-gold cursor-pointer transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              <svg className="w-6 h-6 text-outline hover:text-champagne-gold cursor-pointer transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </div>
          </div>
          {/* Links */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-label-md text-label-md text-charcoal-black mb-4">
                KHÁM PHÁ
              </h4>
              <ul className="space-y-2">
                {FOOTER_LINKS_DISCOVER.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      className="font-body-sm text-body-sm text-on-surface-variant hover:text-champagne-gold transition-colors"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-charcoal-black mb-4">
                HỖ TRỢ
              </h4>
              <ul className="space-y-2">
                {FOOTER_LINKS_SUPPORT.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      className="font-body-sm text-body-sm text-on-surface-variant hover:text-champagne-gold transition-colors"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Contact */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-label-md text-label-md text-charcoal-black mb-4">
              LIÊN HỆ
            </h4>
            <div className="space-y-4">
              {FOOTER_CONTACTS.map((contact, idx) => (
                <p key={idx} className="font-body-sm text-body-sm text-on-surface-variant flex items-start">
                  <MaterialIcon name={contact.icon} className="text-champagne-gold mr-2 text-[18px]" />
                  {contact.text}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-stack-md pt-8 border-t border-outline-variant/30">
          <p className="font-label-md text-label-md text-outline">
            © 2026 SERENITY SPA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
      <DraggableAssistiveButton onClick={() => setShowBookingModal(true)} />
    </div>
  );
}
