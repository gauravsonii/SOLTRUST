import React, { useEffect, useState } from "react";
import { SiSolana } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Buffer } from 'buffer';
import Transactions from "./Transactions";
global.Buffer = Buffer;

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Welcome = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [balance, setBalance] = useState(0);
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        const getBalance = async () => {
            if (wallet.publicKey) {
                try {
                    const balance = await connection.getBalance(wallet.publicKey);
                    setBalance((balance / LAMPORTS_PER_SOL).toFixed(4));
                } catch (error) {
                    console.error("Failed to fetch balance:", error);
                }
            }
        };
        getBalance();
    }, [wallet.publicKey, connection]);

    const sendTokens = async () => {
        const getWallet=async()=>
        {
            walletUpdate=wallet.publickey.toBase58
        }
        if (!wallet.connected) {
            alert("Please connect your wallet.");
            return;
        }
    
        if (!toAddress || !amount) {
            alert("Please enter both an address and an amount.");
            return;
        }
    
        const amountInSOL = parseFloat(amount);
        if (isNaN(amountInSOL) || amountInSOL <= 0) {
            alert("Please enter a valid amount greater than 0.");
            return;
        }
    
        // Validate the public key
        let recipientPublicKey;
        try {
            recipientPublicKey = new PublicKey(toAddress);
            recipientPublicKey=recipientPublicKey.toBase58(); // This will throw if invalid
        } catch (error) {
            alert("Invalid address: " + error.message);
            return;
        }
    
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: recipientPublicKey,
                lamports: amountInSOL * LAMPORTS_PER_SOL,
            })
        );
    
        try {
            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');
            alert(`Sent ${amountInSOL} SOL to ${toAddress}`);
            setToAddress(""); // Clear input after successful transaction
            setAmount(""); // Clear input after successful transaction
            // await getBalance(); // Refresh balance
        } catch (error) {
            console.error("Transaction error:", error);
            alert("Transaction failed: " + error.message);
        }
    };

    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex md:flex-row flex-col items-start justify-between md:p-20 md:gap-64 px-4">
                <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                        Send Crypto <br /> across the world
                    </h1>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Explore the crypto world. Buy and sell cryptocurrencies easily on Krypto.
                    </p>
                    <br />
                    <WalletMultiButton />
                    <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                        <div className={`rounded-tl-2xl ${companyCommonStyles}`}>Reliability</div>
                        <div className={companyCommonStyles}>Security</div>
                        <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>Solana</div>
                        <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>Web 3.0</div>
                        <div className={companyCommonStyles}>Low Fees</div>
                        <div className={`rounded-br-2xl ${companyCommonStyles}`}>Blockchain</div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                    <div className="p-5 flex justify-end items-start flex-col rounded-xl h-52 sm:w-80 w-full my-5 eth-card white-glassmorphism">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                    <SiSolana fontSize={21} color="#fff" />
                                </div>
                                <BsInfoCircle fontSize={17} color="#fff" />
                            </div>
                            <div>
                                <p className="text-white font-light text-sm">SOL Balance:</p>
                                <div className="text-white font-light text-sm">{balance}</div>
                                <p className="text-white font-semibold text-lg mt-1">Solana</p>
                                <p className="text-white font-light text-sm truncate">{wallet.publicKey?.toBase58()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                        <input
                            value={toAddress}
                            onChange={(e) => setToAddress(e.target.value)}
                            placeholder="Address To"
                            type="text"
                            className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                        />
                        <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount (SOL)"
                            type="number"
                            className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                        />
                        <input placeholder="Keyword (Gif)" type="text" className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism" />
                        <input placeholder="Enter Message" type="text" className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism" />
                        <div className="h-[1px] w-full bg-gray-400 my-2" />
                        <button onClick={sendTokens} type="button" className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">
                            Send now
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default Welcome;
