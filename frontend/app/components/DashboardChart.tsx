"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Campaign } from "../types/campaign";
import { formatEth } from "../lib/ethers";

interface Props {
  campaigns: Campaign[];
}

export default function DashboardChart({ campaigns }: Props) {
  const data = campaigns.slice(0, 8).map((c) => ({
    name: c.title.length > 14 ? c.title.slice(0, 14) + "…" : c.title,
    raised: parseFloat(formatEth(c.raised)),
    goal: parseFloat(formatEth(c.goal)),
  }));

  const colors = ["#22c55e", "#38bdf8", "#a78bfa", "#f472b6", "#fb923c"];

  if (!campaigns.length) {
    return (
      <div className="glass rounded-3xl p-8 flex items-center justify-center h-64 text-zinc-500">
        Chưa có dữ liệu chiến dịch
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8">
      <h3 className="text-xl font-bold mb-6">Tiến độ quyên góp</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="25%">
          <XAxis
            dataKey="name"
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v} ETH`}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(9,9,11,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              color: "#fff",
            }}
            formatter={(val: number) => [`${val} ETH`]}
          />
          <Bar dataKey="goal" fill="#ffffff10" radius={[6, 6, 0, 0]} name="Mục tiêu" />
          <Bar dataKey="raised" radius={[6, 6, 0, 0]} name="Đã quyên góp">
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
