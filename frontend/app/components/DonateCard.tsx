"use client";

import { useState } from "react";

export default function DonateCard() {

    const [amount, setAmount] =
        useState("");

    return (
        <div className="glass rounded-3xl p-8">

            <h2 className="text-3xl font-bold">
                Donate Securely
            </h2>

            <p className="text-zinc-400 mt-3">
                Every transaction is stored
                transparently on-chain.
            </p>

            <input
                type="text"
                placeholder="0.5 ETH"
                value={amount}
                onChange={(e) =>
                    setAmount(e.target.value)
                }
                className="
        w-full mt-6 p-4 rounded-2xl
        bg-white/5 border
        border-white/10
        outline-none
      "
            />

            <button
                className="
        mt-6 w-full py-4 rounded-2xl
        bg-green-400 text-black
        font-bold
      "
            >
                Donate
            </button>

        </div>
    );
}