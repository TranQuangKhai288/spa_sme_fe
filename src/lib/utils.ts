export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatVnd(amount: number, locale: "vi" | "en" = "vi"): string {
  const intlLocale = locale === "en" ? "en-US" : "vi-VN";
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M ₫`;
  }
  return new Intl.NumberFormat(intlLocale).format(amount) + " ₫";
}

export function formatLocaleDate(
  date: Date,
  locale: "vi" | "en",
  options?: Intl.DateTimeFormatOptions
): string {
  return date.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", options);
}

export function tierBadgeClass(tier: string): string {
  const map: Record<string, string> = {
    "Kim Cương": "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
    "Bạch Kim": "bg-gradient-to-r from-slate-400 to-slate-600 text-white",
    Vàng: "bg-gradient-to-r from-amber-400 to-amber-600 text-white",
    Bạc: "bg-gray-300 text-dark-slate",
    "Diamond VIP": "bg-soft-gold/15 text-soft-gold border border-soft-gold/30",
    "Gold Member": "bg-jade-green/15 text-jade-green border border-jade-green/30",
    Standard: "bg-tertiary-container/20 text-tertiary border border-tertiary-container/30",
  };
  return map[tier] ?? "bg-jade-green/15 text-jade-green border border-jade-green/30";
}

export function statusBadgeClass(status: string): string {
  switch (status) {
    case "completed":
      return "bg-jade-green/10 text-jade-green border border-jade-green/20";
    case "in_progress":
      return "bg-soft-gold/20 text-soft-gold border border-soft-gold/30";
    case "confirmed":
      return "bg-blue-500/10 text-blue-600 border border-blue-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-500 border border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
}
