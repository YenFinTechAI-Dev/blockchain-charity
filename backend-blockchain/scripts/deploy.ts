import hre from "hardhat";
import { parseEther } from "ethers";

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with:", deployer.address);

    // 1. Deploy TransparencyContract
    const Transparency = await hre.ethers.getContractFactory("TransparencyContract");
    const transparency = await Transparency.deploy();
    await transparency.waitForDeployment();
    const transparencyAddr = await transparency.getAddress();
    console.log("TransparencyContract deployed:", transparencyAddr);

    // 2. Deploy GIVToken
    const GIVToken = await hre.ethers.getContractFactory("GIVToken");
    const givToken = await GIVToken.deploy();
    await givToken.waitForDeployment();
    const givTokenAddr = await givToken.getAddress();
    console.log("GIVToken deployed:", givTokenAddr);

    // 3. Deploy CampaignContract
    const Campaign = await hre.ethers.getContractFactory("CampaignContract");
    const campaign = await Campaign.deploy(transparencyAddr, givTokenAddr);
    await campaign.waitForDeployment();
    const campaignAddr = await campaign.getAddress();
    console.log("CampaignContract deployed:", campaignAddr);

    // 4. Fund CampaignContract với GIV để thưởng donors
    const campaignGIV = parseEther("500000"); // 500k GIV
    await givToken.approve(campaignAddr, campaignGIV);
    await (campaign as any).depositGIV(campaignGIV);
    console.log("Funded CampaignContract with 500,000 GIV");

    // 5. Tạo 3 chiến dịch mẫu
    const tx1 = await (campaign as any).createCampaign(
        "Cứu trợ lũ lụt miền Trung",
        "Hỗ trợ khẩn cấp cho đồng bào bị ảnh hưởng bởi lũ lụt tại miền Trung Việt Nam.",
        "Thiên tai",
        parseEther("10"),
        30,
        "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800"
    );
    await tx1.wait();

    const tx2 = await (campaign as any).createCampaign(
        "Hỗ trợ học sinh nghèo vùng cao",
        "Mua sách vở, đồng phục và dụng cụ học tập cho trẻ em dân tộc thiểu số.",
        "Giáo dục",
        parseEther("5"),
        60,
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800"
    );
    await tx2.wait();

    const tx3 = await (campaign as any).createCampaign(
        "Xây bệnh viện cộng đồng",
        "Xây dựng trạm y tế cộng đồng cho 5000 người dân vùng sâu vùng xa.",
        "Y tế",
        parseEther("20"),
        90,
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800"
    );
    await tx3.wait();

    console.log("3 sample campaigns created!");

    // 6. Xuất địa chỉ contract để dùng trong frontend
    const addresses = {
        TransparencyContract: transparencyAddr,
        GIVToken: givTokenAddr,
        CampaignContract: campaignAddr,
    };

    console.log("\n=== CONTRACT ADDRESSES ===");
    console.log(JSON.stringify(addresses, null, 2));
    console.log("\nCopy these into frontend/app/lib/contract.ts");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
