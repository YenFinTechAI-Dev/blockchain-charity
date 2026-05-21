# GIV Charity — Blockchain Donation Platform

Nền tảng quyên góp từ thiện minh bạch trên Ethereum. Smart contract tự động giải ngân và hoàn tiền.

## 🏗️ Cấu trúc dự án

```
blockchain-charity/
├── backend-blockchain/           # Hardhat + Solidity
│   ├── contracts/
│   │   ├── TransparencyContract.sol   # Ghi log on-chain
│   │   ├── GIVToken.sol               # ERC20 reward token
│   │   ├── CampaignContract.sol       # Contract chính
│   │   └── scripts/deploy.ts          # Deploy script
│   ├── hardhat.config.ts
│   └── package.json
│
└── frontend/                     # Next.js 15 + TypeScript + Tailwind CSS v4
    └── app/
        ├── page.tsx               # Trang chủ
        ├── campaigns/page.tsx     # Danh sách chiến dịch
        ├── donate/page.tsx        # Trang quyên góp
        ├── dashboard/page.tsx     # Dashboard + quản lý
        ├── components/            # UI components
        ├── context/               # WalletContext
        ├── hooks/                 # useCampaign, useDonate...
        ├── lib/                   # ethers.ts, contract.ts
        └── types/                 # TypeScript types
```

---

## 🚀 Chạy trên VS Code (Local)

### Bước 1: Backend — Deploy Smart Contracts

```bash
# Vào thư mục backend
cd blockchain-charity/backend-blockchain

# Cài dependencies
npm install

# Compile contracts
npm run compile

# Mở terminal 1: Chạy Hardhat local node
npm run node
# → Sẽ in ra danh sách 20 accounts với private key

# Mở terminal 2: Deploy contracts
npm run deploy
# → Copy địa chỉ 3 contracts được in ra
```

> 🔑 Sau khi deploy, copy địa chỉ **CampaignContract**, **GIVToken**, **TransparencyContract**
> vào file `frontend/app/lib/contract.ts` phần `CONTRACT_ADDRESSES`

### Bước 2: Cài MetaMask

1. Mở MetaMask → Add Network → **Add manually**
2. Network Name: `Hardhat Local`
3. RPC URL: `http://127.0.0.1:8545`
4. Chain ID: `31337`
5. Currency: `ETH`
6. Import một trong 20 private key từ `npm run node` để có ETH test

### Bước 3: Frontend

```bash
cd blockchain-charity/frontend

# Cài dependencies
npm install

# Chạy dev server
npm run dev
# → Mở http://localhost:3000
```

---

## 🌐 Chạy trên Remix IDE

Remix IDE là cách nhanh nhất để test Solidity contracts.

### Bước 1: Mở Remix

Truy cập: https://remix.ethereum.org

### Bước 2: Upload contracts

Cách 1 — Tạo file thủ công:
- Trong Remix, tạo folder `contracts/`
- Tạo 3 file: `TransparencyContract.sol`, `GIVToken.sol`, `CampaignContract.sol`
- Copy nội dung từ `backend-blockchain/contracts/` vào

Cách 2 — Dùng Remixd (đồng bộ file local):
```bash
npm install -g @remix-project/remixd
remixd -s ./backend-blockchain --remix-ide https://remix.ethereum.org
```
Trong Remix → Workspace dropdown → **Connect to Localhost**

### Bước 3: Compile

- Tab **Solidity Compiler** → chọn version `0.8.20`
- Bật **Enable optimization**
- Compile từng file theo thứ tự:
  1. `TransparencyContract.sol`
  2. `GIVToken.sol`  
  3. `CampaignContract.sol`

### Bước 4: Deploy trên Remix

- Tab **Deploy & Run Transactions**
- Environment: **Remix VM (Shanghai)** (để test) hoặc **Injected Provider - MetaMask**
- Deploy theo thứ tự:
  1. **TransparencyContract** → copy địa chỉ
  2. **GIVToken** → copy địa chỉ
  3. **CampaignContract** → paste 2 địa chỉ trên vào constructor → Deploy

### Bước 5: Test trên Remix

Sau khi deploy, trong phần **Deployed Contracts** bạn có thể:
- Gọi `createCampaign` để tạo chiến dịch
- Gọi `donate` (nhập value ETH ở ô Value) để quyên góp
- Gọi `getAllCampaigns` để xem tất cả campaigns
- Gọi `releaseFunds` khi đạt mục tiêu
- Gọi `refund` khi hết hạn và không đạt mục tiêu

---

## 📋 Smart Contracts

### TransparencyContract
- Ghi log tất cả donations, releases, refunds on-chain
- Events: `DonationReceived`, `FundsReleased`, `RefundIssued`
- Lưu cả struct array để query được

### GIVToken (ERC20)
- Token thưởng cho người quyên góp
- Max supply: 10,000,000 GIV
- Rate: 100 GIV = 1 ETH quyên góp

### CampaignContract (Main)
- `createCampaign(title, description, category, goal, durationDays, imageUrl)`
- `donate(id)` payable — tự động thưởng GIV
- `releaseFunds(id)` — giải ngân khi đạt mục tiêu
- `refund(id)` — hoàn tiền khi hết hạn/không đạt
- `cancelCampaign(id)` — huỷ chiến dịch
- `getAllCampaigns()` — lấy tất cả

---

## 🔧 Environment Variables (Tùy chọn — deploy Testnet)

Tạo file `backend-blockchain/.env`:
```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

Deploy lên Sepolia:
```bash
npm run deploy:sepolia
```

---

## 🎨 Tech Stack

| Phần | Công nghệ |
|------|-----------|
| Smart Contract | Solidity 0.8.20, OpenZeppelin v5 |
| Blockchain Framework | Hardhat |
| Frontend | Next.js 15, React 19 |
| Styling | Tailwind CSS v4 |
| Web3 | ethers.js v6 |
| Charts | Recharts |
| Notifications | react-hot-toast |
