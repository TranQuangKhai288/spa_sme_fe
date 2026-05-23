import type { Metadata } from "next";
import { Sora, DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { SpaDataProvider } from "@/providers/SpaDataProvider";
import { LocaleProvider } from "@/providers/LocaleProvider";
import { MobileChrome } from "@/components/layout/MobileChrome";
import { ToastProvider } from "@/components/ui/Toast";
import { SearchProvider } from "@/providers/SearchProvider";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ZenFlow Spa - Cổng vận hành và dịch vụ chăm sóc",
  description:
    "Trải nghiệm thư giãn, quản lý vận hành và tự động đặt lịch tại ZenFlow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${sora.variable} ${dmSans.variable} ${plusJakartaSans.variable} antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <LocaleProvider>
          <SpaDataProvider>
            <SearchProvider>
              <MobileChrome>{children}</MobileChrome>
              <ToastProvider />
            </SearchProvider>
          </SpaDataProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
