import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers";

describe("CampaignContract", function () {
    let transparency: any;
    let givToken: any;
    let campaign: any;
    let owner: any;
    let donor: any;
    let charity: any;

    beforeEach(async () => {
        [owner, donor, charity] = await ethers.getSigners();

        const T = await ethers.getContractFactory("TransparencyContract");
        transparency = await T.deploy();

        const G = await ethers.getContractFactory("GIVToken");
        givToken = await G.deploy();

        const C = await ethers.getContractFactory("CampaignContract");
        campaign = await C.deploy(
            await transparency.getAddress(),
            await givToken.getAddress()
        );

        // Fund campaign contract with GIV for rewards
        const giveAmount = parseEther("100000");
        await givToken.approve(await campaign.getAddress(), giveAmount);
        await campaign.depositGIV(giveAmount);
    });

    it("creates a campaign", async () => {
        await campaign.connect(charity).createCampaign(
            "Flood Relief",
            "Help flood victims",
            "Thiên tai",
            parseEther("10"),
            30,
            ""
        );
        const c = await campaign.getCampaign(1);
        expect(c.title).to.equal("Flood Relief");
        expect(c.goal).to.equal(parseEther("10"));
    });

    it("accepts donations and awards GIV", async () => {
        await campaign.connect(charity).createCampaign(
            "Test", "Desc", "Giáo dục", parseEther("1"), 30, ""
        );

        const beforeGIV = await givToken.balanceOf(donor.address);
        await campaign.connect(donor).donate(1, { value: parseEther("0.5") });

        const c = await campaign.getCampaign(1);
        expect(c.raised).to.equal(parseEther("0.5"));

        const afterGIV = await givToken.balanceOf(donor.address);
        expect(afterGIV).to.be.gt(beforeGIV);
    });

    it("releases funds when goal reached", async () => {
        await campaign.connect(charity).createCampaign(
            "Test", "Desc", "Y tế", parseEther("1"), 30, ""
        );
        await campaign.connect(donor).donate(1, { value: parseEther("1") });

        const beforeBal = await ethers.provider.getBalance(charity.address);
        await campaign.connect(charity).releaseFunds(1);
        const afterBal = await ethers.provider.getBalance(charity.address);

        expect(afterBal).to.be.gt(beforeBal);
    });

    it("refunds after deadline if goal not reached", async () => {
        await campaign.connect(charity).createCampaign(
            "Test", "Desc", "Khác", parseEther("10"), 1, ""
        );
        await campaign.connect(donor).donate(1, { value: parseEther("1") });

        // Fast forward time
        await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);

        const before = await ethers.provider.getBalance(donor.address);
        const tx = await campaign.connect(donor).refund(1);
        await tx.wait();
        const after = await ethers.provider.getBalance(donor.address);

        expect(after).to.be.gt(before);
    });
});
