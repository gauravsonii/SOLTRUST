// import React, { useContext } from "react";

// // import { TransactionContext } from "../context/TransactionContext";

// import useFetch  from "../hooks/useFetch";
// import dummyData from "../utils/dummyData";
// import { shortenAddress } from "../utils/shortenAddress";

// const TransactionsCard = ({ addressTo,transactionSignature, addressFrom, timestamp, message, keyword, amount, url }) => {
//   const gifUrl = useFetch({ keyword });


//   return (
//     <div className="bg-[#181918] m-4 flex flex-1
//       2xl:min-w-[450px]
//       2xl:max-w-[500px]
//       sm:min-w-[270px]
//       sm:max-w-[300px]
//       min-w-full
//       flex-col p-3 rounded-md hover:shadow-2xl"
//     >
//       <div className="flex flex-col items-center w-full mt-3">
//         <div className="display-flex justify-start w-full mb-6 p-2">
//         <a href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`} target="_blank" rel="noreferrer">
//             <p className="text-white text-base">TransactionSignature: {shortenAddress(transactionSignature)}</p>
//           </a>
//           <a href={`https://explorer.solana.com/tx/${addressFrom}`} target="_blank" rel="noreferrer">
//             <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
//           </a>
//           <a href={`https://cexplorer.solana.com/tx/${addressTo}`} target="_blank" rel="noreferrer">
//             <p className="text-white text-base">To: {shortenAddress(addressTo)}</p>
//           </a>
//           <p className="text-white text-base">Amount: {amount} SOL</p>
//           {message && (
//             <>
//               <br />
//               <p className="text-white text-base">Message: {message}</p>
//             </>
//           )}
//         </div>
//         <img
//           src={gifUrl || url}
//           alt="nature"
//           className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
//         />
//         <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
//           <p className="text-[#37c7da] font-bold">{timestamp}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Transactions = () => {
// //   const {  currentAccount } = useContext(TransactionContext);

//   return (
//     <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
//       <div className="flex flex-col md:p-12 py-12 px-4">
        
//           <h3 className="text-white text-3xl text-center my-2">
//             Latest Transactions
//           </h3>
        
//         <div className="flex flex-wrap justify-center items-center mt-10">
//           {dummyData.reverse().map((transaction, i) => (
//             <TransactionsCard key={i} {...transaction} />
//           ))} 
//          </div>
//       </div>
//     </div>
//   );
// };

// export default Transactions;











import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import dummyData from "../utils/dummyData";
import { shortenAddress } from "../utils/shortenAddress";
import { useWallet } from "@solana/wallet-adapter-react";

const TransactionsCard = ({ addressFrom,addressTo, timestamp, message, keyword, amount,url ,signature}) => {
  const gifUrl = useFetch({ keyword });

  return (
    <div className="bg-[rgb(24,25,24)] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex justify-center items-center w-[40%] mx-auto mb-6 p-2">
        <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">Signature: {shortenAddress(signature)}</p>
          </a>
          <a target="_blank" rel="noreferrer">
            <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
          </a>
          <a target="_blank" rel="noreferrer">
            <p className="text-white text-base">To: {shortenAddress(addressTo)}</p>
          </a>
          <p className="text-white text-base">Amount: {amount} SOL</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}
        </div>
        {/* <img
          src={gifUrl || url}
          alt="nature"
          className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
        /> */}
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const wallet = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [signatures, setsignatures] = useState([])
  const accountAddress = wallet.publicKey?.toBase58();

  useEffect(() => {
    if (accountAddress) {
      fetchTransactions(accountAddress);
    }
  }, [accountAddress]); // Trigger fetchTransactions only when accountAddress changes

  const fetchTransactions = async (accountAddress) => {
    try {
      const res = await fetch(`https://bms-backend-swart.vercel.app/solana/${accountAddress}`);
      if (res.ok) {
        const data = await res.json(); 
        const signatures = data?.result.map(info => info.signature);

        // Fetch transaction details using signatures
        const transactionDetails = await fetchAccountInfo(signatures);
        setTransactions(transactionDetails); // Set fetched transaction details to state
      } else {
        console.error("Failed to fetch transactions: ", res.status);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchAccountInfo = async (signatures) => {
    const transactionDetails = [];

    // Loop through each signature and fetch transaction details
    for (let signature of signatures) {
      try {
        const res = await fetch(`https://bms-backend-swart.vercel.app/transaction/${signature}`);
        if (res.ok) {
          const data = await res.json();

          // Extract details
          const fromAddress = data?.from;
          const toAddress = data?.to;
          const amount = data?.amount;
          const timestamp = data?.timestamp;

          // Push transaction details into the array
          transactionDetails.push({
            fromAddress,
            toAddress,
            transactionSignature: signature, // Add signature for card component
            amount,
            timestamp: new Date(timestamp * 1000).toLocaleString(), // Convert timestamp
            signature:signature
          });
        } else {
          console.error("Failed to fetch transaction: ", res.status);
        }
      } catch (error) {
        console.error("Error fetching transaction details: ", error);
      }
    }

    return transactionDetails; // Return fetched transaction details
  };
  

  

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">Latest Transactions</h3>
        <div className="flex flex-wrap justify-center items-center mt-10">
          {transactions.map((transaction, i) => (
            <TransactionsCard
              key={i}
              addressFrom={transaction.fromAddress}
              addressTo={transaction.toAddress}
              amount={transaction.amount} // Example to get SOL amount
              timestamp={transaction.timestamp}
              signature={transaction.signature}
              // keyword="Solana"
              // message="Transaction Message"
              url="" // Use actual URL if needed
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
