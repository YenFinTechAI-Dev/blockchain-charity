"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CampaignCard from "../components/CampaignCard";
import CreateCampaignForm from "../components/CreateCampaignForm";
import DonateModal from "../components/DonateModal";
import Footer from "../components/Footer";
import StatsBar from "../components/StatsBar";
import { useCampaigns } from "../hooks/useCampaign";
import { Campaign, CampaignCategory } from "../types/campaign";
import { Search } from "lucide-react";

const CATEGORIES: CampaignCategory[] = ["Tất cả", "Thiên tai", "Giáo dục", "Y tế", "Môi trường", "Khác"];

export default function CampaignsPage() {
  const { campaigns, loading, fetchAll } = useCampaigns();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [category, setCategory] = useState<CampaignCategory>("Tất cả");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "ended">("all");

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = campaigns.filter((c) => {
    const matchCat = category === "Tất cả" || c.category === category;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const now = Math.floor(Date.now() / 1000);
    const active = !c.cancelled && !c.released && Number(c.deadline) > now;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && active) ||
      (statusFilter === "ended" && !active);
    return matchCat && matchSearch && matchStatus;
  });

  return (
    <main>
      <Navbar />

      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-3">
            Các chiến dịch từ thiện
          </h1>
          <p className="text-zinc-400 text-lg">
            {campaigns.length} chiến dịch · Tất cả giao dịch minh bạch trên Ethereum
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <StatsBar campaigns={campaigns} />
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm chiến dịch..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-400/50"
            />
          </div>

          {/* Status */}
          <div className="flex gap-2">
            {(["all", "active", "ended"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  statusFilter === s
                    ? "bg-green-400 text-black"
                    : "glass border border-white/10 hover:border-green-400/30"
                }`}
              >
                {{ all: "Tất cả", active: "Đang chạy", ended: "Đã kết thúc" }[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat
                  ? "bg-gradient-to-r from-green-400 to-cyan-400 text-black"
                  : "glass border border-white/10 hover:border-green-400/30 text-zinc-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Create button */}
        <div className="mb-10">
          <CreateCampaignForm onCreated={fetchAll} />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                onDonate={(id) => setSelectedCampaign(campaigns.find((x) => x.id === id)!)}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-20 text-center text-zinc-500">
            Không tìm thấy chiến dịch phù hợp
          </div>
        )}
      </div>

      <Footer />

      {selectedCampaign && (
        <DonateModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onSuccess={fetchAll}
        />
      )}
    </main>
  );
}
