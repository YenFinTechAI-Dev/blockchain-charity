"use client";

import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { getCampaignContract, parseEth } from "../lib/ethers";
import { Campaign } from "../types/campaign";
import toast from "react-hot-toast";

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const contract = await getCampaignContract();
      const raw = await contract.getAllCampaigns();
      const mapped: Campaign[] = raw.map((c: any) => ({
        id: Number(c.id),
        title: c.title,
        description: c.description,
        category: c.category,
        goal: c.goal,
        deadline: c.deadline,
        raised: c.raised,
        donorCount: Number(c.donorCount),
        charity: c.charity,
        released: c.released,
        cancelled: c.cancelled,
        imageUrl: c.imageUrl,
      }));
      setCampaigns(mapped);
    } catch (e) {
      toast.error("Không thể tải danh sách chiến dịch");
    } finally {
      setLoading(false);
    }
  }, []);

  return { campaigns, loading, fetchAll };
}

export function useDonate() {
  const [loading, setLoading] = useState(false);

  const donate = useCallback(async (campaignId: number, amountEth: string) => {
    setLoading(true);
    try {
      const contract = await getCampaignContract(true);
      const value = parseEth(amountEth);
      const tx = await contract.donate(campaignId, { value });
      toast.loading("Đang xử lý giao dịch...", { id: "donate" });
      await tx.wait();
      toast.success(`Quyên góp ${amountEth} ETH thành công! 🎉`, { id: "donate" });
      return true;
    } catch (e: any) {
      toast.error(e?.reason || "Giao dịch thất bại", { id: "donate" });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { donate, loading };
}

export function useCreateCampaign() {
  const [loading, setLoading] = useState(false);

  const create = useCallback(
    async (data: {
      title: string;
      description: string;
      category: string;
      goalEth: string;
      durationDays: number;
      imageUrl: string;
    }) => {
      setLoading(true);
      try {
        const contract = await getCampaignContract(true);
        const goalWei = parseEth(data.goalEth);
        const tx = await contract.createCampaign(
          data.title,
          data.description,
          data.category,
          goalWei,
          data.durationDays,
          data.imageUrl
        );
        toast.loading("Đang tạo chiến dịch...", { id: "create" });
        await tx.wait();
        toast.success("Chiến dịch đã được tạo!", { id: "create" });
        return true;
      } catch (e: any) {
        toast.error(e?.reason || "Tạo chiến dịch thất bại", { id: "create" });
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { create, loading };
}

export function useReleaseFunds() {
  const [loading, setLoading] = useState(false);

  const release = useCallback(async (campaignId: number) => {
    setLoading(true);
    try {
      const contract = await getCampaignContract(true);
      const tx = await contract.releaseFunds(campaignId);
      toast.loading("Đang giải ngân...", { id: "release" });
      await tx.wait();
      toast.success("Giải ngân thành công!", { id: "release" });
      return true;
    } catch (e: any) {
      toast.error(e?.reason || "Giải ngân thất bại", { id: "release" });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { release, loading };
}

export function useRefund() {
  const [loading, setLoading] = useState(false);

  const refund = useCallback(async (campaignId: number) => {
    setLoading(true);
    try {
      const contract = await getCampaignContract(true);
      const tx = await contract.refund(campaignId);
      toast.loading("Đang hoàn tiền...", { id: "refund" });
      await tx.wait();
      toast.success("Hoàn tiền thành công!", { id: "refund" });
      return true;
    } catch (e: any) {
      toast.error(e?.reason || "Hoàn tiền thất bại", { id: "refund" });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { refund, loading };
}
