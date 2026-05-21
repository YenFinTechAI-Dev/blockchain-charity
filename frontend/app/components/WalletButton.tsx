"use client";

import { useState } from "react";

declare global {
    interface Window {
        ethereum?: any;
    }
}

export default function WalletButton() {

    const [connected, setConnected] =
        useState(false);

    async function connectWallet() {

        if (!window.ethereum) {
            alert("Install MetaMask");
            return;
        }

        await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        setConnected(true);
    }

    return (
        <button onClick={connectWallet}>
            {connected
                ? "Connected"
                : "Connect Wallet"}
        </button>
    );
}