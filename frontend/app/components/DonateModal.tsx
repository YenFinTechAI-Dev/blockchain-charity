"use client";

import { useState } from "react";
import { X, Wallet, Zap } from "lucide-react";
import { Campaign } from "../types/campaign";
import { useDonate } from "../hooks/useCampaign";
import { useWallet } from "../context/WalletContext";
import { formatEth } from "../lib/ethers";

interface Props {
  campaign: Campaign;
  onClose: () => void;
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = ["0.01", "0.05", "0.1", "0.5", "1"];

export default function DonateModal({ campaign, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const { donate, loading } = useDonate();
  const { isConnected, connect } = useWallet();

  async function handleDonate() {
    if (!amount || parseFloat(amount) <= 0) return;
    const ok = await donate(campaign.id, amount);
    if (ok) {
      onSuccess?.();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-3xl p-8 w-full max-w-md relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-1">Quyên góp</h2>
        <p className="text-zinc-400 text-sm mb-6 line-clamp-1">{campaign.title}</p>

        {/* Progress mini */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-400">Đã đạt</span>
            <span className="text-green-400 font-semibold">
              {formatEth(campaign.raised)} / {formatEth(campaign.goal)} ETH
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
              style={{
                width: `${Math.min(100, Number((campaign.raised * 100n) / campaign.goal))}%`,
              }}
            />
          </div>
        </div>

        {/* Quick amounts */}
        <p className="text-sm text-zinc-400 mb-3">Chọn nhanh</p>
        <div className="flex gap-2 mb-4 flex-wrap">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              onClick={() => setAmount(q)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                amount === q
                  ? "bg-green-400 text-black"
                  : "glass border border-white/10 hover:border-green-400/50"
              }`}
            >
              {q} ETH
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="relative mb-6">
          <input
            type="number"
            placeholder="Nhập số lượng ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.001"
            min="0"
            className="w-full p-4 pr-16 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-400/50 transition-colors text-lg"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">
            ETH
          </span>
        </div>

        {/* GIV reward hint */}
        {amount && parseFloat(amount) > 0 && (
          <div className="flex items-center gap-2 glass rounded-2xl p-3 mb-6 border border-green-400/20">
            <Zap className="w-4 h-4 text-green-400 shrink-0" />
            <span className="text-sm text-zinc-300">
              Bạn sẽ nhận được{" "}
              <span className="text-green-400 font-semibold">
                {(parseFloat(amount) * 100).toFixed(0)} GIV
              </span>{" "}
              token thưởng
            </span>
          </div>
        )}

        {/* Action */}
        {isConnected ? (
          <button
            onClick={handleDonate}
            disabled={!amount || parseFloat(amount) <= 0 || loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold text-lg glow hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : `Quyên góp ${amount || "0"} ETH`}
          </button>
        ) : (
          <button
            onClick={connect}
            className="w-full py-4 rounded-2xl glass border border-white/20 font-bold flex items-center justify-center gap-2 hover:border-green-400/50 transition-colors"
          >
            <Wallet className="w-5 h-5" />
            Kết nối ví để quyên góp
          </button>
        )}
      </div>
    </div>
  );
}
