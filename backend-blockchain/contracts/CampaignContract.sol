// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TransparencyContract.sol";
import "./GIVToken.sol";

/// @title CampaignContract
/// @notice Hệ thống quản lý chiến dịch từ thiện minh bạch trên blockchain
contract CampaignContract {
    // ─── Structs ───────────────────────────────────────
    struct Campaign {
        uint id;
        string title;
        string description;
        string category;
        uint goal;          // đơn vị wei
        uint deadline;      // unix timestamp
        uint raised;        // tổng đã quyên góp (wei)
        uint donorCount;
        address payable charity;
        bool released;
        bool cancelled;
        string imageUrl;
    }

    // ─── State ────────────────────────────────────────
    uint public campaignCount;
    address public owner;

    mapping(uint => Campaign) public campaigns;
    mapping(uint => mapping(address => uint)) public donations;
    mapping(uint => address[]) private campaignDonors;

    TransparencyContract public transparency;
    GIVToken public givToken;

    uint public constant GIV_REWARD_RATE = 100; // 1 ETH = 100 GIV

    // ─── Events ───────────────────────────────────────
    event CampaignCreated(
        uint indexed id,
        string title,
        address indexed charity,
        uint goal,
        uint deadline
    );
    event DonationMade(
        uint indexed campaignId,
        address indexed donor,
        uint amount
    );
    event FundsReleased(uint indexed campaignId, uint amount);
    event RefundIssued(uint indexed campaignId, address indexed donor, uint amount);
    event CampaignCancelled(uint indexed campaignId);

    // ─── Modifiers ────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier campaignExists(uint id) {
        require(id > 0 && id <= campaignCount, "Campaign not found");
        _;
    }

    // ─── Constructor ──────────────────────────────────
    constructor(address _transparency, address _givToken) {
        owner = msg.sender;
        transparency = TransparencyContract(_transparency);
        givToken = GIVToken(_givToken);
    }

    // ─── Functions ────────────────────────────────────

    /// @notice Tạo chiến dịch từ thiện mới
    function createCampaign(
        string memory title,
        string memory description,
        string memory category,
        uint goal,
        uint durationDays,
        string memory imageUrl
    ) public {
        require(bytes(title).length > 0, "Title required");
        require(goal > 0, "Goal must be > 0");
        require(durationDays > 0 && durationDays <= 365, "Invalid duration");

        campaignCount++;
        uint deadline = block.timestamp + (durationDays * 1 days);

        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            title: title,
            description: description,
            category: category,
            goal: goal,
            deadline: deadline,
            raised: 0,
            donorCount: 0,
            charity: payable(msg.sender),
            released: false,
            cancelled: false,
            imageUrl: imageUrl
        });

        emit CampaignCreated(campaignCount, title, msg.sender, goal, deadline);
    }

    /// @notice Quyên góp ETH vào chiến dịch
    function donate(uint id) public payable campaignExists(id) {
        Campaign storage c = campaigns[id];
        require(!c.cancelled, "Campaign cancelled");
        require(block.timestamp < c.deadline, "Campaign ended");
        require(msg.value > 0, "Amount must be > 0");

        if (donations[id][msg.sender] == 0) {
            campaignDonors[id].push(msg.sender);
            c.donorCount++;
        }

        c.raised += msg.value;
        donations[id][msg.sender] += msg.value;

        // Thưởng GIV token cho người quyên góp
        uint givReward = (msg.value * GIV_REWARD_RATE) / 1 ether;
        if (givReward > 0 && givToken.balanceOf(address(this)) >= givReward) {
            givToken.transfer(msg.sender, givReward);
        }

        transparency.logDonation(id, msg.sender, msg.value);
        emit DonationMade(id, msg.sender, msg.value);
    }

    /// @notice Giải phóng quỹ cho tổ chức từ thiện khi đạt mục tiêu
    function releaseFunds(uint id) public campaignExists(id) {
        Campaign storage c = campaigns[id];
        require(msg.sender == c.charity || msg.sender == owner, "Not authorized");
        require(c.raised >= c.goal, "Goal not reached");
        require(!c.released, "Already released");
        require(!c.cancelled, "Cancelled");

        c.released = true;
        uint amount = c.raised;

        (bool success, ) = c.charity.call{value: amount}("");
        require(success, "Transfer failed");

        transparency.logRelease(id, c.charity, amount);
        emit FundsReleased(id, amount);
    }

    /// @notice Hoàn tiền khi chiến dịch không đạt mục tiêu
    function refund(uint id) public campaignExists(id) {
        Campaign storage c = campaigns[id];
        require(
            block.timestamp > c.deadline || c.cancelled,
            "Campaign still active"
        );
        require(!c.released, "Funds already released");

        uint donated = donations[id][msg.sender];
        require(donated > 0, "No donation to refund");

        donations[id][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: donated}("");
        require(success, "Refund failed");

        transparency.logRefund(id, msg.sender, donated);
        emit RefundIssued(id, msg.sender, donated);
    }

    /// @notice Huỷ chiến dịch (chỉ owner hoặc người tạo)
    function cancelCampaign(uint id) public campaignExists(id) {
        Campaign storage c = campaigns[id];
        require(msg.sender == c.charity || msg.sender == owner, "Not authorized");
        require(!c.released, "Already released");
        require(!c.cancelled, "Already cancelled");

        c.cancelled = true;
        emit CampaignCancelled(id);
    }

    // ─── View Functions ───────────────────────────────

    function getCampaign(uint id) public view campaignExists(id) returns (Campaign memory) {
        return campaigns[id];
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory all = new Campaign[](campaignCount);
        for (uint i = 1; i <= campaignCount; i++) {
            all[i - 1] = campaigns[i];
        }
        return all;
    }

    function getDonors(uint id) public view campaignExists(id) returns (address[] memory) {
        return campaignDonors[id];
    }

    function getProgress(uint id) public view campaignExists(id) returns (uint percent) {
        Campaign memory c = campaigns[id];
        if (c.goal == 0) return 0;
        percent = (c.raised * 100) / c.goal;
        if (percent > 100) percent = 100;
    }

    function isActive(uint id) public view campaignExists(id) returns (bool) {
        Campaign memory c = campaigns[id];
        return !c.cancelled && !c.released && block.timestamp < c.deadline;
    }

    // Nhận ETH trực tiếp để fund hợp đồng (cho GIV rewards)
    receive() external payable {}

    function depositGIV(uint amount) external onlyOwner {
        givToken.transferFrom(msg.sender, address(this), amount);
    }
}
