// ─── Contract Addresses ───────────────────────────────────
// Sau khi chạy `npm run deploy` trong backend-blockchain,
// copy địa chỉ contract vào đây.
export const CONTRACT_ADDRESSES = {
  CampaignContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  TransparencyContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  GIVToken: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
} as const;

// ─── CampaignContract ABI ─────────────────────────────────
export const CAMPAIGN_ABI = [
  // Read
  "function campaignCount() view returns (uint)",
  "function getCampaign(uint id) view returns (tuple(uint id, string title, string description, string category, uint goal, uint deadline, uint raised, uint donorCount, address charity, bool released, bool cancelled, string imageUrl))",
  "function getAllCampaigns() view returns (tuple(uint id, string title, string description, string category, uint goal, uint deadline, uint raised, uint donorCount, address charity, bool released, bool cancelled, string imageUrl)[])",
  "function donations(uint campaignId, address donor) view returns (uint)",
  "function getProgress(uint id) view returns (uint)",
  "function isActive(uint id) view returns (bool)",
  "function getDonors(uint id) view returns (address[])",

  // Write
  "function createCampaign(string title, string description, string category, uint goal, uint durationDays, string imageUrl) public",
  "function donate(uint id) public payable",
  "function releaseFunds(uint id) public",
  "function refund(uint id) public",
  "function cancelCampaign(uint id) public",

  // Events
  "event CampaignCreated(uint indexed id, string title, address indexed charity, uint goal, uint deadline)",
  "event DonationMade(uint indexed campaignId, address indexed donor, uint amount)",
  "event FundsReleased(uint indexed campaignId, uint amount)",
  "event RefundIssued(uint indexed campaignId, address indexed donor, uint amount)",
] as const;

// ─── GIVToken ABI ─────────────────────────────────────────
export const GIV_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
] as const;

// ─── TransparencyContract ABI ─────────────────────────────
export const TRANSPARENCY_ABI = [
  "function getDonationLogs() view returns (tuple(uint campaignId, address donor, uint amount, uint timestamp)[])",
  "function getReleaseLogs() view returns (tuple(uint campaignId, address charity, uint amount, uint timestamp)[])",
  "function getRefundLogs() view returns (tuple(uint campaignId, address donor, uint amount, uint timestamp)[])",
  "function getDonationCount() view returns (uint)",
  "event DonationReceived(uint indexed campaignId, address indexed donor, uint amount, uint timestamp)",
  "event FundsReleased(uint indexed campaignId, address indexed charity, uint amount, uint timestamp)",
  "event RefundIssued(uint indexed campaignId, address indexed donor, uint amount, uint timestamp)",
] as const;
