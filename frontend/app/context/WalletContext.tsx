"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { getProvider, getGIVTokenContract, formatEth } from "../lib/ethers";
import toast from "react-hot-toast";

interface WalletCtx {
  address: string | null;
  balance: string;
  givBalance: string;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletCtx | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [givBalance, setGivBalance] = useState("0");
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchBalances = useCallback(async (addr: string) => {
    try {
      const provider = await getProvider();
      const bal = await provider.getBalance(addr);
      setBalance(formatEth(bal, 4));

      const giv = await getGIVTokenContract();
      const givBal = await giv.balanceOf(addr);
      setGivBalance(parseFloat(ethers.formatEther(givBal)).toFixed(2));
    } catch {
      // ignore
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("Vui lòng cài MetaMask!");
      return;
    }
    setIsConnecting(true);
    try {
      const provider = await getProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAddress(accounts[0]);
      setChainId(Number(network.chainId));
      await fetchBalances(accounts[0]);
      toast.success("Kết nối ví thành công!");
    } catch (e: any) {
      toast.error("Kết nối thất bại");
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalances]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance("0");
    setGivBalance("0");
    setChainId(null);
    toast("Đã ngắt kết nối ví");
  }, []);

  // Auto-connect if already authorized
  useEffect(() => {
    (async () => {
      if (!window.ethereum) return;
      try {
        const provider = await getProvider();
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          setAddress(accounts[0]);
          setChainId(Number(network.chainId));
          await fetchBalances(accounts[0]);
        }
      } catch {}
    })();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accs: string[]) => {
        if (accs.length === 0) disconnect();
        else {
          setAddress(accs[0]);
          fetchBalances(accs[0]);
        }
      });
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, [disconnect, fetchBalances]);

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        givBalance,
        chainId,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be inside WalletProvider");
  return ctx;
}
