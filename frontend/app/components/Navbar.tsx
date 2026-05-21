"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, List, Home, Coins } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { shortenAddress } from "../lib/ethers";

export default function Navbar() {
  const pathname = usePathname();
  const { address, balance, givBalance, isConnected, isConnecting, connect, disconnect } =
    useWallet();

  const links = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/campaigns", label: "Chiến dịch", icon: List },
    { href: "/donate", label: "Quyên góp", icon: Heart },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-black">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center">
            <Heart className="w-4 h-4 text-black" />
          </div>
          <span className="gradient-text">GIV Charity</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${pathname === href
                  ? "bg-green-400/20 text-green-400"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* Wallet */}
        <div className="flex items-center gap-3">
          {isConnected && (
            <div className="hidden sm:flex items-center gap-3 text-sm">
              <span className="text-zinc-400">
                <span className="text-white font-semibold">{balance}</span> ETH
              </span>
              <span className="flex items-center gap-1 text-green-400">
                <Coins className="w-3.5 h-3.5" />
                <span className="font-semibold">{givBalance}</span> GIV
              </span>
            </div>
          )}

          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-green-400/10 text-green-400 text-sm font-mono border border-green-400/20">
                {shortenAddress(address!)}
              </span>
              <button
                onClick={disconnect}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                Ngắt kết nối
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold text-sm glow hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isConnecting ? "Đang kết nối..." : "Kết nối ví"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
