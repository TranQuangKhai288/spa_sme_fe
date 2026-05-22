"use client";

import { useState } from "react";
import { useSpaData } from "@/hooks/useSpaData";
import { formatVnd, tierBadgeClass } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function CustomersView() {
  const { clients } = useSpaData();
  const [query, setQuery] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-dark-slate sm:text-3xl">
            {`Quản lý khách hàng`}
          </h1>
          <p className="text-sm text-on-surface-variant/80">
            {`${clients.length} khách hàng trong hệ thống`}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
          />
          <input
            type="search"
            placeholder={`Tìm theo tên, email, SĐT...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-glass-border bg-white/40 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/40"
          />
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
                className="h-12 w-12 rounded-full object-cover"
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
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-glass-border pt-3 text-center text-xs">
              <div>
                <p className="font-bold text-jade-green">
                  {client.totalVisits}
                </p>
                <p className="text-on-surface-variant">{`Lượt visit`}</p>
              </div>
              <div>
                <p className="font-medium">{client.lastVisit}</p>
                <p className="text-on-surface-variant">{`Lần cuối`}</p>
              </div>
              <div>
                <p className="font-medium">{formatVnd(client.totalSpent)}</p>
                <p className="text-on-surface-variant">{`Tổng chi`}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Desktop table */}
      <GlassCard className="hidden overflow-hidden rounded-4xl p-0 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-250 text-left">
            <thead>
              <tr className="border-b border-glass-border bg-white/30">
                {[
                  `Khách hàng`,
                  `Điện thoại`,
                  `Hạng VIP`,
                  `Lượt visit`,
                  `Lần cuối`,
                  `Tổng chi`,
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="font-cta px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"
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
                  className="cursor-pointer transition-colors hover:bg-white/30"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={client.avatar}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-soft-gold/30"
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
                  <td className="px-6 py-6 text-sm text-on-surface-variant">
                    {client.phone}
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${tierBadgeClass(client.tier)}`}
                    >
                      {client.tier}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-lg font-bold text-jade-green">
                    {client.totalVisits}
                  </td>
                  <td className="px-6 py-6 text-sm text-on-surface-variant">
                    {client.lastVisit}
                  </td>
                  <td className="px-6 py-6 text-sm font-semibold">
                    {formatVnd(client.totalSpent)}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <MaterialIcon
                      name="more_vert"
                      className="text-on-surface-variant hover:text-jade-green"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
