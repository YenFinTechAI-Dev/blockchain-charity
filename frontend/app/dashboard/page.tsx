"use client";

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardChart from "../components/DashboardChart";
import StatsBar from "../components/StatsBar";
import { useCampaigns, useReleaseFunds, useRefund } from "../hooks/useCampaign";
import { useWallet } from "../context/WalletContext";
import { formatEth, daysLeft, progressPercent, shortenAddress } from "../lib/ethers";
import { CheckCircle, RefreshCw, RotateCcw } from "lucide-react";

export default function DashboardPage() {
  const { campaigns, loading, fetchAll } = useCampaigns();
  const { release, loading: releasing } = useReleaseFunds();
  const { refund, loading: refunding } = useRefund();
  const { address } = useWallet();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const myCampaigns = campaigns.filter(
    (c) => address && c.charity.toLowerCase() === address.toLowerCase()
  );

  const myDonations = campaigns; // Simplification; in production query blockchain for user donations

  return (
    <main>
      <Navbar />

      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black mb-2">Dashboard</h1>
            <p className="text-zinc-400">
              {address ? `Ví: ${shortenAddress(address)}` : "Kết nối ví để xem thông tin của bạn"}
            </p>
          </div>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 text-sm hover:border-green-400/30 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <StatsBar campaigns={campaigns} />
        </div>

        {/* Chart */}
        <div className="mb-12">
          <DashboardChart campaigns={campaigns} />
        </div>

        {/* My Campaigns */}
        {myCampaigns.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Chiến dịch của tôi ({myCampaigns.length})</h2>
            <div className="space-y-4">
              {myCampaigns.map((c) => {
                const progress = progressPercent(c.raised, c.goal);
                const days = daysLeft(c.deadline);
                const canRelease = c.raised >= c.goal && !c.released && !c.cancelled;
                const canRefund = (days === 0 || c.cancelled) && !c.released && c.raised < c.goal;

                return (
                  <div key={c.id} className="glass rounded-2xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{c.title}</h3>
                          {c.released && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-400/20 text-green-400 border border-green-400/30">
                              Hoàn thành
                            </span>
                          )}
                          {c.cancelled && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-400/20 text-red-400 border border-red-400/30">
                              Đã huỷ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-zinc-400 mb-3">
                          <span>{formatEth(c.raised)} / {formatEth(c.goal)} ETH</span>
                          <span>{c.donorCount} người quyên góp</span>
                          <span>{days > 0 ? `${days} ngày còn lại` : "Hết hạn"}</span>
                        </div>
                        <div className="w-full max-w-sm h-2 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 mt-1 block">{progress}%</span>
                      </div>

                      <div className="flex gap-2">
                        {canRelease && (
                          <button
                            onClick={() => release(c.id).then(fetchAll)}
                            disabled={releasing}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-400 text-black font-bold text-sm hover:opacity-90 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Giải ngân
                          </button>
                        )}
                        {canRefund && (
                          <button
                            onClick={() => refund(c.id).then(fetchAll)}
                            disabled={refunding}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-400/20 text-orange-400 border border-orange-400/30 text-sm hover:bg-orange-400/30 disabled:opacity-50"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Hoàn tiền
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All campaigns table */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Tất cả chiến dịch</h2>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["#", "Tiêu đề", "Mục tiêu", "Đã quyên", "Tiến độ", "Donors", "Trạng thái"].map(
                    (h) => (
                      <th key={h} className="px-4 py-3 text-left text-zinc-400 font-medium">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 rounded bg-white/5 animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : campaigns.map((c) => {
                      const prog = progressPercent(c.raised, c.goal);
                      const days = daysLeft(c.deadline);
                      const statusColor = c.released
                        ? "text-green-400"
                        : c.cancelled
                        ? "text-red-400"
                        : days === 0
                        ? "text-zinc-500"
                        : "text-cyan-400";
                      const statusText = c.released
                        ? "Hoàn thành"
                        : c.cancelled
                        ? "Huỷ"
                        : days === 0
                        ? "Hết hạn"
                        : "Đang chạy";
                      return (
                        <tr key={c.id} className="border-t border-white/5 hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3 text-zinc-500">{c.id}</td>
                          <td className="px-4 py-3 font-medium max-w-[180px] truncate">{c.title}</td>
                          <td className="px-4 py-3 text-zinc-400">{formatEth(c.goal)} ETH</td>
                          <td className="px-4 py-3 text-green-400 font-semibold">{formatEth(c.raised)} ETH</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-white/10">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
                                  style={{ width: `${prog}%` }}
                                />
                              </div>
                              <span className="text-zinc-400">{prog}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-zinc-400">{c.donorCount}</td>
                          <td className={`px-4 py-3 font-medium ${statusColor}`}>{statusText}</td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
