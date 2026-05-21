import { ethers, BrowserProvider, Contract } from "ethers";
import { CAMPAIGN_ABI, GIV_TOKEN_ABI, CONTRACT_ADDRESSES } from "./contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function getProvider(): Promise<BrowserProvider> {
  if (!window.ethereum) throw new Error("MetaMask chưa được cài đặt");
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = await getProvider();
  return provider.getSigner();
}

export async function getCampaignContract(withSigner = false) {
  if (withSigner) {
    const signer = await getSigner();
    return new Contract(
      CONTRACT_ADDRESSES.CampaignContract,
      CAMPAIGN_ABI,
      signer
    );
  }
  const provider = await getProvider();
  return new Contract(
    CONTRACT_ADDRESSES.CampaignContract,
    CAMPAIGN_ABI,
    provider
  );
}

export async function getGIVTokenContract(withSigner = false) {
  if (withSigner) {
    const signer = await getSigner();
    return new Contract(CONTRACT_ADDRESSES.GIVToken, GIV_TOKEN_ABI, signer);
  }
  const provider = await getProvider();
  return new Contract(CONTRACT_ADDRESSES.GIVToken, GIV_TOKEN_ABI, provider);
}

export function formatEth(wei: bigint, decimals = 4): string {
  return parseFloat(ethers.formatEther(wei)).toFixed(decimals);
}

export function parseEth(amount: string): bigint {
  return ethers.parseEther(amount);
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(ts: bigint): string {
  return new Date(Number(ts) * 1000).toLocaleDateString("vi-VN");
}

export function daysLeft(deadline: bigint): number {
  const now = Math.floor(Date.now() / 1000);
  const diff = Number(deadline) - now;
  return Math.max(0, Math.floor(diff / 86400));
}

export function progressPercent(raised: bigint, goal: bigint): number {
  if (goal === 0n) return 0;
  return Math.min(100, Number((raised * 100n) / goal));
}
