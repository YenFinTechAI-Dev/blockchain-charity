// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DonationContract {
    struct Campaign {
        uint256 id;
        address owner;
        string title;
        string description;
        uint256 targetAmount;
        uint256 donatedAmount;
        uint256 deadline;
        bool completed;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    // =========================
    // STORAGE
    // =========================

    uint256 public campaignCount;

    mapping(uint256 => Campaign) public campaigns;

    mapping(uint256 => Donation[]) public donations;

    // =========================
    // EVENTS
    // =========================

    event CampaignCreated(
        uint256 indexed id,
        address indexed owner,
        string title,
        uint256 targetAmount
    );

    event Donated(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event Withdrawn(uint256 indexed campaignId, uint256 amount);

    // =========================
    // CREATE CAMPAIGN
    // =========================

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _deadline
    ) public {
        require(bytes(_title).length > 0, "Title required");

        require(_targetAmount > 0, "Invalid target");

        require(_deadline > block.timestamp, "Invalid deadline");

        campaignCount++;

        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            owner: msg.sender,
            title: _title,
            description: _description,
            targetAmount: _targetAmount,
            donatedAmount: 0,
            deadline: _deadline,
            completed: false
        });

        emit CampaignCreated(campaignCount, msg.sender, _title, _targetAmount);
    }

    // =========================
    // DONATE ETH
    // =========================

    function donate(uint256 _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];

        require(campaign.id != 0, "Campaign not found");

        require(block.timestamp < campaign.deadline, "Campaign ended");

        require(msg.value > 0, "Donation must be > 0");

        campaign.donatedAmount += msg.value;

        donations[_campaignId].push(
            Donation({
                donor: msg.sender,
                amount: msg.value,
                timestamp: block.timestamp
            })
        );

        emit Donated(_campaignId, msg.sender, msg.value);
    }

    // =========================
    // WITHDRAW FUNDS
    // =========================

    function withdrawFunds(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];

        require(campaign.id != 0, "Campaign not found");

        require(msg.sender == campaign.owner, "Not campaign owner");

        require(!campaign.completed, "Already withdrawn");

        require(campaign.donatedAmount > 0, "No funds");

        uint256 amount = campaign.donatedAmount;

        campaign.completed = true;

        (bool success, ) = payable(campaign.owner).call{value: amount}("");

        require(success, "Transfer failed");

        emit Withdrawn(_campaignId, amount);
    }

    // =========================
    // GET ALL CAMPAIGNS
    // =========================

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);

        for (uint256 i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }

        return allCampaigns;
    }

    // =========================
    // GET SINGLE CAMPAIGN
    // =========================

    function getCampaign(
        uint256 _campaignId
    ) public view returns (Campaign memory) {
        return campaigns[_campaignId];
    }

    // =========================
    // GET DONATIONS
    // =========================

    function getDonations(
        uint256 _campaignId
    ) public view returns (Donation[] memory) {
        return donations[_campaignId];
    }

    // =========================
    // CONTRACT BALANCE
    // =========================

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
