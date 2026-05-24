"use client";

import { useState, useRef, useEffect } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { formatVnd, formatDateString, tierBadgeClass } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { showToast } from "@/components/ui/Toast";
import type { Client } from "@/types/spa";
import { useSearch } from "@/providers/SearchProvider";
import { CreateClientModal } from "./CreateClientModal";
import {
  CalendarPlus,
  User,
  Pencil,
  MessageSquare,
  Star,
  Trash2,
  UserPlus,
  MoreVertical,
} from "lucide-react";

function ClientActionMenu({
  client,
  onClose,
}: {
  client: Client;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-8 top-4 z-50 w-44 rounded-xl border border-glass-border bg-white/95 shadow-2xl backdrop-blur-xl overflow-hidden"
    >
      {[
        {
          icon: CalendarPlus,
          label: "Tạo lịch hẹn",
          action: () => {
            showToast(`Mở form đặt lịch cho ${client.name}`, "info");
            onClose();
          },
        },
        {
          icon: User,
          label: "Xem hồ sơ",
          action: () => {
            showToast("Tính năng đang phát triển", "info");
            onClose();
          },
        },
        {
          icon: Pencil,
          label: "Chỉnh sửa",
          action: () => {
            showToast("Tính năng đang phát triển", "info");
            onClose();
          },
        },
        {
          icon: MessageSquare,
          label: "Gửi SMS",
          action: () => {
            showToast(`Đã gửi SMS cho ${client.name}`, "success");
            onClose();
          },
        },
        {
          icon: Star,
          label: "Nâng hạng VIP",
          action: () => {
            showToast(`Đã đánh dấu ${client.name} nâng hạng`, "success");
            onClose();
          },
        },
      ].map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-slate hover:bg-primary/5 hover:text-primary transition-colors text-left"
          >
            <IconComponent size={18} className="text-on-surface-variant" />
            {item.label}
          </button>
        );
      })}
      <div className="border-t border-glass-border">
        <button
          onClick={() => {
            showToast(`Đã xóa khách hàng (mock)`, "warning");
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
        >
          <Trash2 size={18} />
          Xóa khách hàng
        </button>
      </div>
    </div>
  );
}

const TIER_FILTERS = ["Tất cả", "Kim Cương", "Bạch Kim", "Vàng", "Bạc"];

export function CustomersView() {
  const { clients } = useSpaData();
  const { query } = useSearch();
  const [tierFilter, setTierFilter] = useState("Tất cả");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "visits" | "spent">("visits");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = clients
    .filter((c) => {
      const matchQuery =
        !query.trim() ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query);
      const matchTier = tierFilter === "Tất cả" || c.tier === tierFilter;
      return matchQuery && matchTier;
    })
    .sort((a, b) => {
      if (sortBy === "visits") return b.totalVisits - a.totalVisits;
      if (sortBy === "spent") return b.totalSpent - a.totalSpent;
      return a.name.localeCompare(b.name, "vi");
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-dark-slate sm:text-3xl">
            Quản lý khách hàng
          </h1>
          <p className="text-sm text-on-surface-variant/80">
            {filtered.length}/{clients.length} khách hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Add client button — search is in the header */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline">Thêm khách</span>
          </button>
        </div>
      </div>

      {/* Tier filter pills */}
      <div className="flex gap-2 flex-wrap">
        {TIER_FILTERS.map((tier) => (
          <button
            key={tier}
            onClick={() => setTierFilter(tier)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tierFilter === tier
              ? "bg-primary text-white shadow-md"
              : "bg-white/50 border border-glass-border text-on-surface-variant hover:bg-white/70"
              }`}
          >
            {tier}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-on-surface-variant/60">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs border border-glass-border rounded-lg px-2 py-1 bg-white/50 outline-none"
          >
            <option value="visits">Lượt visit</option>
            <option value="spent">Tổng chi</option>
            <option value="name">Tên</option>
          </select>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((client) => (
          <GlassCard key={client.id} className="p-4">
            <div className="flex items-center gap-3">
              <img
                src={client.avatar}
                alt=""
                className="h-12 w-12 rounded-full object-cover ring-2 ring-soft-gold/20"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-dark-slate">{client.name}</p>
                <p className="truncate text-xs text-on-surface-variant">
                  {client.email}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${tierBadgeClass(client.tier)}`}
                >
                  {client.tier}
                </span>
              </div>
              <button
                onClick={() =>
                  showToast(`SMS gửi đến ${client.name}`, "success")
                }
                className="rounded-full p-2 hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"
              >
                <MessageSquare size={20} />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-glass-border pt-3 text-center text-xs">
              <div>
                <p className="font-bold text-jade-green text-base">
                  {client.totalVisits}
                </p>
                <p className="text-on-surface-variant">Lượt visit</p>
              </div>
              <div>
                <p className="font-medium">{formatDateString(client.lastVisit)}</p>
                <p className="text-on-surface-variant">Lần cuối</p>
              </div>
              <div>
                <p className="font-medium">{formatVnd(client.totalSpent)}</p>
                <p className="text-on-surface-variant">Tổng chi</p>
              </div>
            </div>
            {client.notes && (
              <p className="mt-2 text-[11px] italic text-on-surface-variant/70 border-t border-glass-border pt-2">
                {client.notes}
              </p>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Desktop table */}
      <GlassCard className="hidden overflow-hidden rounded-3xl p-0 md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-glass-border bg-white/30">
                {[
                  "Khách hàng",
                  "Điện thoại",
                  "Hạng VIP",
                  "Điểm thưởng",
                  "Lượt visit",
                  "Lần cuối",
                  "Tổng chi",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="font-cta px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/10">
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  className="relative cursor-pointer transition-colors hover:bg-white/30 group"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={client.avatar}
                        alt=""
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-soft-gold/20"
                      />
                      <div>
                        <p className="font-semibold text-dark-slate">
                          {client.name}
                        </p>
                        <p className="text-xs text-on-surface-variant/60">
                          {client.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant whitespace-nowrap">
                    {client.phone}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${tierBadgeClass(client.tier)}`}
                    >
                      {client.tier}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-soft-gold font-bold whitespace-nowrap">
                      <Star size={14} fill="currentColor" />
                      {client.memberPoints.toLocaleString("vi-VN")}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-lg font-bold text-jade-green whitespace-nowrap">
                    {client.totalVisits}
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant whitespace-nowrap">
                    {formatDateString(client.lastVisit)}
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold whitespace-nowrap">
                    {formatVnd(client.totalSpent)}
                  </td>
                  <td className="px-6 py-5 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === client.id ? null : client.id,
                        );
                      }}
                      className="rounded-full p-1 hover:bg-white/50 text-on-surface-variant hover:text-jade-green transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openMenuId === client.id && (
                      <ClientActionMenu
                        client={client}
                        onClose={() => setOpenMenuId(null)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {modalOpen && (
        <CreateClientModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
