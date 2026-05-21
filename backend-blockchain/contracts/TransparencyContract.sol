// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title TransparencyContract
/// @notice Ghi lại toàn bộ giao dịch on-chain để minh bạch
contract TransparencyContract {
    struct DonationRecord {
        uint campaignId;
        address donor;
        uint amount;
        uint timestamp;
    }

    struct ReleaseRecord {
        uint campaignId;
        address charity;
        uint amount;
        uint timestamp;
    }

    struct RefundRecord {
        uint campaignId;
        address donor;
        uint amount;
        uint timestamp;
    }

    DonationRecord[] public donationLogs;
    ReleaseRecord[] public releaseLogs;
    RefundRecord[] public refundLogs;

    event DonationReceived(
        uint indexed campaignId,
        address indexed donor,
        uint amount,
        uint timestamp
    );

    event FundsReleased(
        uint indexed campaignId,
        address indexed charity,
        uint amount,
        uint timestamp
    );

    event RefundIssued(
        uint indexed campaignId,
        address indexed donor,
        uint amount,
        uint timestamp
    );

    function logDonation(
        uint campaignId,
        address donor,
        uint amount
    ) external {
        donationLogs.push(DonationRecord(campaignId, donor, amount, block.timestamp));
        emit DonationReceived(campaignId, donor, amount, block.timestamp);
    }

    function logRelease(
        uint campaignId,
        address charity,
        uint amount
    ) external {
        releaseLogs.push(ReleaseRecord(campaignId, charity, amount, block.timestamp));
        emit FundsReleased(campaignId, charity, amount, block.timestamp);
    }

    function logRefund(
        uint campaignId,
        address donor,
        uint amount
    ) external {
        refundLogs.push(RefundRecord(campaignId, donor, amount, block.timestamp));
        emit RefundIssued(campaignId, donor, amount, block.timestamp);
    }

    function getDonationLogs() external view returns (DonationRecord[] memory) {
        return donationLogs;
    }

    function getReleaseLogs() external view returns (ReleaseRecord[] memory) {
        return releaseLogs;
    }

    function getRefundLogs() external view returns (RefundRecord[] memory) {
        return refundLogs;
    }

    function getDonationCount() external view returns (uint) {
        return donationLogs.length;
    }
}
