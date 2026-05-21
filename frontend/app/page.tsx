"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import Navbar from "./components/Navbar";
import CampaignCard from "./components/CampaignCard";
import DashboardChart from "./components/DashboardChart";
import StatsBar from "./components/StatsBar";
import Footer from "./components/Footer";
import DonateModal from "./components/DonateModal";
import { useCampaigns } from "./hooks/useCampaign";
import { Campaign } from "./types/campaign";

const FEATURES = [
  {
    icon: Shield,
    title: "Minh bạch 100%",
    desc: "Mọi giao dịch quyên góp đều được ghi nhận vĩnh viễn trên blockchain, không ai có thể sửa đổi.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Zap,
    title: "Hoàn tiền tự động",
    desc: "Nếu chiến dịch không đạt mục tiêu trước deadline, smart contract tự động hoàn lại toàn bộ ETH.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: Globe,
    title: "Token thưởng GIV",
    desc: "Người quyên góp nhận GIV token tỷ lệ 100 GIV/ETH — dùng để tham gia quản trị cộng đồng.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

export default function Home() {
  const { campaigns, loading, fetchAll } = useCampaigns();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const activeCampaigns = campaigns.filter((c) => !c.cancelled && !c.released).slice(0, 3);

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-400/20 text-green-400 text-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Đang hoạt động trên Ethereum
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-tight">
            Từ Thiện Minh Bạch
            <br />
            <span className="gradient-text">Trên Blockchain</span>
          </h1>

          <p className="mt-8 text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Mỗi đồng quyên góp được theo dõi on-chain. Smart contract tự động giải ngân khi đạt mục tiêu
            và hoàn tiền nếu không đạt — hoàn toàn tự động, không cần tin tưởng.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link
              href="/campaigns"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold text-lg glow hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
            >
              Xem chiến dịch
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/donate"
              className="px-8 py-4 rounded-2xl glass border border-white/20 font-bold text-lg hover:bg-white/5 transition-colors"
            >
              Quyên góp ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <StatsBar campaigns={campaigns} />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <h2 className="text-4xl font-black text-center mb-12">
          Tại sao chọn <span className="gradient-text">GIV Charity?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="glass rounded-3xl p-8">
              <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black">Chiến dịch nổi bật</h2>
          <Link
            href="/campaigns"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : activeCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCampaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                onDonate={(id) => setSelectedCampaign(campaigns.find((x) => x.id === id)!)}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-16 text-center text-zinc-500">
            Chưa có chiến dịch nào. Hãy là người đầu tiên tạo chiến dịch!
          </div>
        )}
      </section>

      {/* Chart */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <DashboardChart campaigns={campaigns} />
      </section>

      <Footer />

      {/* Donate Modal */}
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
