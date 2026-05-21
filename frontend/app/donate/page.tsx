"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCampaigns, useDonate } from "../hooks/useCampaign";
import { useWallet } from "../context/WalletContext";
import { formatEth, daysLeft, progressPercent } from "../lib/ethers";
import { Campaign } from "../types/campaign";
import { Heart, Zap, ChevronDown } from "lucide-react";

const QUICK_AMOUNTS = ["0.01", "0.05", "0.1", "0.5", "1", "5"];

export default function DonatePage() {
  const { campaigns, loading, fetchAll } = useCampaigns();
  const { donate, loading: donating } = useDonate();
  const { isConnected, connect } = useWallet();
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState("");
  const [showSelect, setShowSelect] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (campaigns.length > 0 && !selected) {
      const first = campaigns.find((c) => !c.cancelled && !c.released);
      if (first) setSelected(first);
    }
  }, [campaigns, selected]);

  async function handleDonate() {
    if (!selected || !amount) return;
    const ok = await donate(selected.id, amount);
    if (ok) { setAmount(""); fetchAll(); }
  }

  const activeCampaigns = campaigns.filter(
    (c) => !c.cancelled && !c.released && daysLeft(c.deadline) > 0
  );

  return (
    <main>
      <Navbar />

      <div className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">
            Quyên góp <span className="gradient-text">từ thiện</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Giao dịch an toàn, minh bạch 100% trên blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Donate form */}
          <div className="lg:col-span-3 glass rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">Chi tiết quyên góp</h2>

            {/* Campaign selector */}
            <div className="mb-6 relative">
              <label className="text-sm text-zinc-400 mb-2 block">Chọn chiến dịch</label>
              <button
                onClick={() => setShowSelect(!showSelect)}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left flex items-center justify-between hover:border-green-400/30 transition-colors"
              >
                <span>{selected?.title ?? "Chọn chiến dịch..."}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSelect ? "rotate-180" : ""}`} />
              </button>

              {showSelect && (
                <div className="absolute top-full left-0 right-0 z-10 mt-2 glass rounded-2xl border border-white/10 overflow-hidden max-h-64 overflow-y-auto">
                  {activeCampaigns.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setSelected(c); setShowSelect(false); }}
                      className={`w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                        selected?.id === c.id ? "bg-green-400/10 text-green-400" : ""
                      }`}
                    >
                      <div className="font-medium">{c.title}</div>
                      <div className="text-sm text-zinc-400 mt-0.5">
                        {formatEth(c.raised)} / {formatEth(c.goal)} ETH · {daysLeft(c.deadline)} ngày còn lại
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected campaign info */}
            {selected && (
              <div className="glass rounded-2xl p-4 mb-6 border border-white/5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Tiến độ</span>
                  <span className="text-green-400 font-semibold">
                    {progressPercent(selected.raised, selected.goal)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
                    style={{ width: `${progressPercent(selected.raised, selected.goal)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Quick amounts */}
            <div className="mb-4">
              <label className="text-sm text-zinc-400 mb-2 block">Chọn nhanh</label>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(q)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      amount === q
                        ? "bg-green-400 text-black"
                        : "glass border border-white/10 hover:border-green-400/30"
                    }`}
                  >
                    {q} ETH
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div className="relative mb-6">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Hoặc nhập số lượng tùy chọn"
                min="0.001"
                step="0.001"
                className="w-full p-4 pr-16 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-400/50 text-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">ETH</span>
            </div>

            {/* GIV reward */}
            {amount && parseFloat(amount) > 0 && (
              <div className="flex items-center gap-2 glass rounded-2xl p-3 mb-6 border border-green-400/20">
                <Zap className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-sm text-zinc-300">
                  Bạn nhận{" "}
                  <span className="text-green-400 font-bold">
                    {(parseFloat(amount) * 100).toFixed(0)} GIV
                  </span>{" "}
                  token thưởng
                </span>
              </div>
            )}

            {isConnected ? (
              <button
                onClick={handleDonate}
                disabled={donating || !selected || !amount || parseFloat(amount) <= 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold text-lg glow hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                {donating ? "Đang xử lý..." : `Quyên góp ${amount || "0"} ETH`}
              </button>
            ) : (
              <button
                onClick={connect}
                className="w-full py-4 rounded-2xl glass border border-white/20 font-bold hover:border-green-400/50 transition-colors"
              >
                Kết nối ví MetaMask
              </button>
            )}
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold mb-3 text-green-400">Cách hoạt động</h3>
              <ol className="text-sm text-zinc-400 space-y-2.5">
                {[
                  "Kết nối ví MetaMask",
                  "Chọn chiến dịch từ thiện",
                  "Nhập số ETH muốn quyên góp",
                  "Xác nhận giao dịch trên MetaMask",
                  "Nhận GIV token thưởng ngay lập tức",
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-400/20 text-green-400 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold mb-3 text-cyan-400">Bảo đảm</h3>
              <ul className="text-sm text-zinc-400 space-y-2">
                {[
                  "✅ Smart contract đã được audit",
                  "✅ Tự động hoàn tiền nếu không đạt mục tiêu",
                  "✅ Không ai có thể chiếm dụng quỹ",
                  "✅ Lịch sử giao dịch công khai",
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
