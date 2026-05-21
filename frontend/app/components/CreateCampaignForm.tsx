"use client";

import { useState } from "react";
import { useCreateCampaign } from "../hooks/useCampaign";
import { useWallet } from "../context/WalletContext";
import { PlusCircle } from "lucide-react";

const CATEGORIES = ["Thiên tai", "Giáo dục", "Y tế", "Môi trường", "Khác"];

interface Props {
  onCreated?: () => void;
}

export default function CreateCampaignForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Thiên tai",
    goalEth: "",
    durationDays: 30,
    imageUrl: "",
  });
  const { create, loading } = useCreateCampaign();
  const { isConnected, connect } = useWallet();

  function set(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.title || !form.goalEth) return;
    const ok = await create(form);
    if (ok) {
      setOpen(false);
      setForm({ title: "", description: "", category: "Thiên tai", goalEth: "", durationDays: 30, imageUrl: "" });
      onCreated?.();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => isConnected ? setOpen(true) : connect()}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold glow hover:opacity-90 transition-opacity"
      >
        <PlusCircle className="w-5 h-5" />
        Tạo chiến dịch mới
      </button>
    );
  }

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-2xl font-bold mb-6">Tạo chiến dịch từ thiện</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="text-sm text-zinc-400 mb-1 block">Tiêu đề *</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Tên chiến dịch"
            className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-400/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-zinc-400 mb-1 block">Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Mô tả chi tiết về chiến dịch..."
            rows={3}
            className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-400/50 resize-none"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Danh mục</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-400/50 text-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-zinc-900">{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Mục tiêu (ETH) *</label>
          <input
            type="number"
            value={form.goalEth}
            onChange={(e) => set("goalEth", e.target.value)}
            placeholder="10"
            min="0.01"
            step="0.01"
            className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-400/50"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Thời hạn (ngày)</label>
          <input
            type="number"
            value={form.durationDays}
            onChange={(e) => set("durationDays", parseInt(e.target.value))}
            min={1}
            max={365}
            className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-400/50"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-1 block">URL ảnh bìa</label>
          <input
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="https://..."
            className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-400/50"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading || !form.title || !form.goalEth}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold glow hover:opacity-90 transition-opacity disabled:opacity-30"
        >
          {loading ? "Đang tạo..." : "Tạo chiến dịch"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="px-6 py-3.5 rounded-2xl glass border border-white/10 hover:bg-white/10"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}
