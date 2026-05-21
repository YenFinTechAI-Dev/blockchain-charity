"use client";

import { Campaign } from "../types/campaign";
import { formatEth } from "../lib/ethers";
import { ethers } from "ethers";

interface Props {
  campaigns: Campaign[];
}

export default function StatsBar({ campaigns: cs }: Props) {
  const totalRaised = cs.reduce((acc, c) => acc + c.raised, 0n);
  const totalDonors = cs.reduce((acc, c) => acc + c.donorCount, 0);
  const activeCount = cs.filter((c) => !c.cancelled && !c.released).length;
  const completedCount = cs.filter((c) => c.released).length;

  const stats = [
    { label: "Tổng quyên góp", value: `${formatEth(totalRaised)} ETH`, color: "text-green-400" },
    { label: "Người quyên góp", value: totalDonors.toString(), color: "text-cyan-400" },
    { label: "Chiến dịch đang chạy", value: activeCount.toString(), color: "text-blue-400" },
    { label: "Chiến dịch hoàn thành", value: completedCount.toString(), color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass rounded-2xl p-5 text-center">
          <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
          <div className="text-zinc-400 text-sm mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
