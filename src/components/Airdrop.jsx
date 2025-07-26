import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function Airdrop() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState("");

    async function requestAirdrop() {
        const amountInSOL = parseFloat(amount);
        if (isNaN(amountInSOL) || amountInSOL <= 0) {
            alert("Please enter a valid amount greater than 0.");
            return;
        }

        try {
            const airdropSignature = await connection.requestAirdrop(
                wallet.publicKey,
                amountInSOL * LAMPORTS_PER_SOL
            );
            await connection.confirmTransaction(airdropSignature);
            alert(`Airdropped ${amountInSOL} SOL to ${wallet.publicKey.toBase58()}`);
        } catch (error) {
            alert("Airdrop failed: " + error.message);
        }
    }

    return (
        <div>
          <center>
            <br/><br/>
            <input
                type="number"
                placeholder="Amount (SOL)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-black border-none text-sm"
            />
            <button
                onClick={requestAirdrop}
                className="mt-2 p-2 bg-blue-500 text-white rounded"
            >
                Request Airdrop
            </button>
            </center>
        </div>

    );
}
