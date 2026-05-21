import { Heart, Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-bold gradient-text">GIV Charity</span>
          </div>

          <p className="text-zinc-500 text-sm text-center">
            Nền tảng quyên góp từ thiện minh bạch trên Blockchain · Mọi giao dịch đều được ghi nhận on-chain
          </p>

          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors text-sm">Trang chủ</Link>
            <Link href="/campaigns" className="hover:text-white transition-colors text-sm">Chiến dịch</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors text-sm">Dashboard</Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center text-zinc-600 text-sm">
          © 2026 GIV Charity · Built with ❤️ on Ethereum
        </div>
      </div>
    </footer>
  );
}
