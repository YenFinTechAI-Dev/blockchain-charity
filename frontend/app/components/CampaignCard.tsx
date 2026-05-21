"use client";

import { Clock, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Campaign } from "../types/campaign";
import { formatEth, daysLeft, progressPercent } from "../lib/ethers";

interface Props {
  campaign: Campaign;
  onDonate?: (id: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Thiên tai": "from-red-400/20 to-orange-400/20 border-red-400/30 text-red-400",
  "Giáo dục": "from-blue-400/20 to-indigo-400/20 border-blue-400/30 text-blue-400",
  "Y tế": "from-green-400/20 to-teal-400/20 border-green-400/30 text-green-400",
  "Môi trường": "from-emerald-400/20 to-cyan-400/20 border-emerald-400/30 text-emerald-400",
  default: "from-purple-400/20 to-pink-400/20 border-purple-400/30 text-purple-400",
};

const CATEGORY_ICONS: Record<string, string> = {
  "Thiên tai": "🌊",
  "Giáo dục": "📚",
  "Y tế": "🏥",
  "Môi trường": "🌿",
  default: "💚",
};

export default function CampaignCard({ campaign, onDonate }: Props) {
  const progress = progressPercent(campaign.raised, campaign.goal);
  const days = daysLeft(campaign.deadline);
  const goalEth = formatEth(campaign.goal);
  const raisedEth = formatEth(campaign.raised);
  const catColor = CATEGORY_COLORS[campaign.category] ?? CATEGORY_COLORS.default;
  const catIcon = CATEGORY_ICONS[campaign.category] ?? CATEGORY_ICONS.default;

  const statusBadge = campaign.cancelled
    ? { label: "Đã huỷ", cls: "bg-red-500/20 text-red-400 border-red-500/30" }
    : campaign.released
    ? { label: "Hoàn thành", cls: "bg-green-500/20 text-green-400 border-green-500/30" }
    : days === 0
    ? { label: "Đã kết thúc", cls: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" }
    : { label: "Đang hoạt động", cls: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" };

  return (
    <div className="glass rounded-3xl overflow-hidden hover:translate-y-[-6px] transition-all duration-300 hover:shadow-xl hover:shadow-green-500/5 flex flex-col">
      {/* Image */}
      {campaign.imageUrl && (
        <div className="h-44 overflow-hidden relative">
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold border bg-gradient-to-r ${catColor}`}
          >
            {catIcon} {campaign.category || "Khác"}
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${statusBadge.cls}`}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{campaign.title}</h2>
        <p className="text-zinc-400 text-sm mb-5 line-clamp-2">{campaign.description}</p>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-400">Đã quyên góp</span>
            <span className="font-semibold text-green-400">{progress}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-white font-semibold">{raisedEth} ETH</span>
            <span className="text-zinc-500">/ {goalEth} ETH</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-5 text-sm text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{days > 0 ? `${days} ngày còn lại` : "Đã hết hạn"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{campaign.donorCount} người quyên góp</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onDonate?.(campaign.id)}
            disabled={campaign.cancelled || campaign.released || days === 0}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Quyên góp ngay
          </button>
          <Link
            href={`/campaigns/${campaign.id}`}
            className="px-4 py-3 rounded-2xl glass border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-1"
          >
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
