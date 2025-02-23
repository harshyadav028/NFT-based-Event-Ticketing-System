// // test nft anf tranfer nft minting passed
// "use client";
// import React, { useState } from "react";
// import { AptosClient } from "aptos";
// import { Aptos, Network, AptosConfig } from "@aptos-labs/ts-sdk";
// import { Ticket, Wallet, RefreshCw, X } from "lucide-react";

// const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
// const client = new AptosClient(NODE_URL);
// const config = new AptosConfig({ network: Network.DEVNET });
// const aptos = new Aptos(config);

// const NFTTicketSystem = () => {
//   const [account, setAccount] = useState("");
//   const [nfts, setNFTs] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedNFT, setSelectedNFT] = useState(null);
//   const [buyerAddress, setBuyerAddress] = useState(""); // New state for buyer's address

//   // Connect to Petra Wallet
//   const connectWallet = async () => {
//     if (window.aptos) {
//       try {
//         const response = await window.aptos.connect();
//         setAccount(response.address);
//         console.log("Wallet connected:", response.address);
//         await fetchNFTs(response.address);
//       } catch (error) {
//         console.error("Wallet connection error:", error);
//       }
//     } else {
//       alert("Please install Petra Wallet from https://www.petrawallet.io/");
//     }
//   };

//   // Fetch NFTs function remains the same
//   const fetchNFTs = async (address) => {
//     try {
//       const resources = await client.getAccountResources(address);
//       console.log("Account resources:", resources);

//       const tokenStore = resources.find(
//         (r) => r.type === "0x3::token::TokenStore"
//       );

//       if (tokenStore) {
//         const currentTime = new Date();
//         const newNFT = {
//           id: nfts.length,
//           name: `Ticket #${nfts.length + 1}`,
//           description: "Event Ticket NFT",
//           tokenId: `Token-${Date.now()}`,
//           eventDetails: {
//             eventName: "Sample Event",
//             seatNumber: `A${nfts.length + 1}`,
//             ticketType: "VIP",
//             perks: ["Free Drink", "Early Entry"],
//             mintTime: currentTime.toLocaleString(),
//           },
//         };

//         setNFTs((prevNFTs) => [...prevNFTs, newNFT]);
//         console.log("Added new NFT:", newNFT);
//       }
//     } catch (error) {
//       console.error("Error fetching NFTs:", error);
//     }
//   };

//   // New function to transfer NFT
//   const transferNFT = async (nft, recipientAddress) => {
//     if (!account || !recipientAddress) {
//       alert("Please ensure both sender and recipient addresses are available");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const transferTransaction = await aptos.transferDigitalAssetTransaction({
//         sender: { accountAddress: account },
//         digitalAssetAddress: nft.tokenId,
//         recipient: recipientAddress,
//       });

//       const committedTxn = await window.aptos.signAndSubmitTransaction(
//         transferTransaction
//       );
//       await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

//       // Refresh NFTs after transfer
//       await fetchNFTs(account);
//       alert("NFT transferred successfully!");
//       setSelectedNFT(null);
//     } catch (error) {
//       console.error("Error transferring NFT:", error);
//       alert("Failed to transfer NFT: " + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Existing functions remain the same
//   const viewNFTDetails = (nft) => {
//     setSelectedNFT(nft);
//   };

//   const closeNFTDetails = () => {
//     setSelectedNFT(null);
//     setBuyerAddress(""); // Reset buyer address when closing modal
//   };

//   const mintTicket = async (ticketDetails) => {
//     if (!account) {
//       alert("Please connect your wallet first");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const collectionName = "Event_Tickets";
//       const tokenName = `Ticket_${Date.now()}`;

//       try {
//         const createCollectionPayload = {
//           type: "entry_function_payload",
//           function: "0x3::token::create_collection_script",
//           type_arguments: [],
//           arguments: [
//             collectionName,
//             "Event Ticket Collection",
//             "https://example.com/collection",
//             1000,
//             [false, false, false],
//           ],
//         };
//         const createCollectionTxn = await window.aptos.signAndSubmitTransaction(
//           createCollectionPayload
//         );
//         await client.waitForTransaction(createCollectionTxn.hash);
//       } catch (error) {
//         console.log("Collection might already exist:", error.message);
//       }

//       const mintTokenPayload = {
//         type: "entry_function_payload",
//         function: "0x3::token::create_token_script",
//         type_arguments: [],
//         arguments: [
//           collectionName,
//           tokenName,
//           `Ticket for ${ticketDetails.eventName}`,
//           1,
//           1000,
//           "https://example.com/ticket",
//           account,
//           0,
//           0,
//           [false, false, false, false, false],
//           [],
//           [],
//           [],
//         ],
//       };

//       const mintTxn = await window.aptos.signAndSubmitTransaction(
//         mintTokenPayload
//       );
//       await client.waitForTransaction(mintTxn.hash);
//       await fetchNFTs(account);
//     } catch (error) {
//       console.error("Error minting ticket:", error);
//       alert("Failed to mint ticket: " + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen text-white">
//       <div className="max-w-6xl mx-auto">
//         {/* Wallet Connection */}
//         <div className="mb-8">
//           {!account ? (
//             <button
//               onClick={connectWallet}
//               className="group relative overflow-hidden px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
//             >
//               <div className="flex items-center gap-2">
//                 <Wallet className="w-5 h-5" />
//                 <span>Connect Wallet</span>
//               </div>
//               <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
//             </button>
//           ) : (
//             <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-lg">
//               <Wallet className="w-4 h-4" />
//               <span>
//                 {account.slice(0, 6)}...{account.slice(-4)}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-4 mb-8">
//           <button
//             onClick={() =>
//               mintTicket({
//                 eventName: "Sample Event",
//                 eventId: "1",
//                 seatNumber: "A1",
//                 ticketType: "VIP",
//                 perks: ["Free Drink", "Early Entry"],
//               })
//             }
//             disabled={!account || isLoading}
//             className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Ticket className="w-5 h-5" />
//             {isLoading ? "Minting..." : "Mint Ticket"}
//           </button>

//           <button
//             onClick={() => fetchNFTs(account)}
//             disabled={!account}
//             className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Refresh NFTs
//           </button>
//         </div>

//         {/* NFT Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {nfts.map((nft) => (
//             <div
//               key={nft.id}
//               className="group bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1"
//             >
//               <h3 className="font-bold text-xl mb-2">{nft.name}</h3>
//               <p className="text-gray-400">{nft.description}</p>
//               <div className="mt-4">
//                 <p className="text-sm text-gray-500">Token ID: {nft.tokenId}</p>
//                 <button
//                   onClick={() => viewNFTDetails(nft)}
//                   className="mt-3 w-full bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-lg transform transition-all duration-300 hover:scale-105"
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* NFT Details Modal */}
//         {selectedNFT && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
//             <div className="bg-slate-800 border border-white/10 p-8 rounded-2xl max-w-md w-full transform transition-all">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold">{selectedNFT.name}</h2>
//                 <button
//                   onClick={closeNFTDetails}
//                   className="text-gray-400 hover:text-white transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {/* NFT Details */}
//                 <div className="space-y-2">
//                   {Object.entries(selectedNFT.eventDetails || {}).map(
//                     ([key, value]) => (
//                       <p key={key} className="flex justify-between">
//                         <span className="text-gray-400">{key}:</span>
//                         <span className="font-medium">
//                           {Array.isArray(value) ? value.join(", ") : value}
//                         </span>
//                       </p>
//                     )
//                   )}
//                 </div>

//                 {/* Transfer Section */}
//                 <div className="mt-6 pt-6 border-t border-white/10">
//                   <h3 className="font-bold text-lg mb-4">Transfer Ticket</h3>
//                   <input
//                     type="text"
//                     placeholder="Enter recipient's address"
//                     value={buyerAddress}
//                     onChange={(e) => setBuyerAddress(e.target.value)}
//                     className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-purple-500 transition-colors"
//                   />
//                   <button
//                     onClick={() => transferNFT(selectedNFT, buyerAddress)}
//                     disabled={isLoading || !buyerAddress}
//                     className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105"
//                   >
//                     {isLoading ? "Transferring..." : "Transfer Ticket"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NFTTicketSystem;

// test 2
"use client";
import React, { useState } from "react";
import { AptosClient } from "aptos";
import { Aptos, Network, AptosConfig } from "@aptos-labs/ts-sdk";
import {
  Ticket,
  Wallet,
  RefreshCw,
  X,
  Ban,
  Calendar,
  Clock,
  Tag,
  Star,
} from "lucide-react";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
const client = new AptosClient(NODE_URL);
const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

const NFTTicketSystem = () => {
  const [account, setAccount] = useState("");
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [buyerAddress, setBuyerAddress] = useState("");
  const [transferHistory, setTransferHistory] = useState([]);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const TICKET_PRICE = 100; // Price in APT

  // Connect to Petra Wallet
  const connectWallet = async () => {
    if (window.aptos) {
      try {
        const response = await window.aptos.connect();
        setAccount(response.address);
        console.log("Wallet connected:", response.address);
        await fetchNFTs(response.address);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("Please install Petra Wallet");
    }
  };

  const fetchNFTs = async (address) => {
    try {
      const resources = await client.getAccountResources(address);
      const tokenStore = resources.find(
        (r) => r.type === "0x3::token::TokenStore"
      );

      if (tokenStore) {
        const currentTime = new Date();
        const newNFT = {
          id: nfts.length,
          name: `Ticket #${nfts.length + 1}`,
          description: "Premium Event Ticket NFT",
          tokenId: `Token-${Date.now()}`,
          eventDetails: {
            eventName: "Web3 Summit 2025",
            seatNumber: `A${nfts.length + 1}`,
            ticketType: "VIP Access",
            perks: ["Priority Entry", "VIP Lounge", "Meet & Greet"],
            mintTime: currentTime.toLocaleString(),
            price: TICKET_PRICE,
          },
        };

        setNFTs((prevNFTs) => [...prevNFTs, newNFT]);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const transferNFT = async (nft, recipientAddress) => {
    if (!account || !recipientAddress) {
      alert("Please ensure wallet connection and recipient address");
      return;
    }

    setIsLoading(true);
    try {
      // First transfer NFT
      const transferTransaction = await aptos.transferDigitalAssetTransaction({
        sender: { accountAddress: account },
        digitalAssetAddress: nft.tokenId,
        recipient: recipientAddress,
      });

      const committedTxn = await window.aptos.signAndSubmitTransaction(
        transferTransaction
      );
      await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

      // Record transfer details
      const newTransfer = {
        nftId: nft.tokenId,
        buyerAddress: recipientAddress,
        timestamp: Date.now(),
        price: TICKET_PRICE,
        transactionHash: committedTxn.hash,
        eventName: nft.eventDetails.eventName,
        seatNumber: nft.eventDetails.seatNumber,
      };

      setTransferHistory((prev) => [...prev, newTransfer]);
      await fetchNFTs(account);
      setSelectedNFT(null);

      // Show success toast
      alert("NFT transferred successfully!");
    } catch (error) {
      console.error("Transfer error:", error);
      alert("Transfer failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEvent = async () => {
    if (!account || transferHistory.length === 0) {
      alert("No transfers to refund");
      return;
    }

    setIsCancelling(true);
    setIsRefunding(true);
    try {
      // Group refunds by buyer
      const refundsByBuyer = transferHistory.reduce((acc, transfer) => {
        acc[transfer.buyerAddress] =
          (acc[transfer.buyerAddress] || 0) + transfer.price;
        return acc;
      }, {});

      // Process refunds
      for (const [buyerAddress, totalAmount] of Object.entries(
        refundsByBuyer
      )) {
        const transferTxn = await aptos.transaction.build.simple({
          sender: account,
          data: {
            function: "0x1::coin::transfer",
            typeArguments: ["0x1::aptos_coin::AptosCoin"],
            functionArguments: [buyerAddress, totalAmount],
          },
        });

        const committedTxn = await window.aptos.signAndSubmitTransaction(
          transferTxn
        );
        await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
      }

      setTransferHistory([]);
      alert("Event cancelled and refunds processed!");
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("Refund failed: " + error.message);
    } finally {
      setIsCancelling(false);
      setIsRefunding(false);
    }
  };

  const mintTicket = async () => {
    if (!account) {
      alert("Please connect wallet first");
      return;
    }

    setIsLoading(true);
    try {
      const collectionName = "Premium_Event_Tickets";
      const tokenName = `VIP_Ticket_${Date.now()}`;

      // Create collection if doesn't exist
      try {
        const createCollectionPayload = {
          type: "entry_function_payload",
          function: "0x3::token::create_collection_script",
          type_arguments: [],
          arguments: [
            collectionName,
            "Premium Event Tickets",
            "https://example.com/tickets",
            1000,
            [false, false, false],
          ],
        };
        const createCollectionTxn = await window.aptos.signAndSubmitTransaction(
          createCollectionPayload
        );
        await client.waitForTransaction(createCollectionTxn.hash);
      } catch (error) {
        console.log("Collection exists:", error.message);
      }

      // Mint new ticket
      const mintTokenPayload = {
        type: "entry_function_payload",
        function: "0x3::token::create_token_script",
        type_arguments: [],
        arguments: [
          collectionName,
          tokenName,
          "Premium Event Access Pass",
          1,
          1000,
          "https://example.com/ticket",
          account,
          0,
          0,
          [false, false, false, false, false],
          [],
          [],
          [],
        ],
      };

      const mintTxn = await window.aptos.signAndSubmitTransaction(
        mintTokenPayload
      );
      await client.waitForTransaction(mintTxn.hash);
      await fetchNFTs(account);
    } catch (error) {
      console.error("Minting error:", error);
      alert("Minting failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function in your NFTTicketSystem component
  const viewNFTDetails = (nft) => {
    setSelectedNFT(nft);
    setBuyerAddress(""); // Reset buyer address when opening new NFT details

    // Create detailed view data for modal
    const enrichedNFT = {
      ...nft,
      eventDetails: {
        ...nft.eventDetails,
        displayPrice: `${TICKET_PRICE} APT`,
        formattedTime: new Date(nft.eventDetails.mintTime).toLocaleString(),
        status: transferHistory.find((t) => t.nftId === nft.tokenId)
          ? "Transferred"
          : "Available",
      },
    };

    setSelectedNFT(enrichedNFT);
  };

  // You can also add these helper functions for enhanced functionality
  const closeNFTDetails = () => {
    setSelectedNFT(null);
    setBuyerAddress("");
  };

  const isNFTTransferred = (nftId) => {
    return transferHistory.some((transfer) => transfer.nftId === nftId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            NFT Event Ticketing System
          </h1>
          <p className="text-gray-400">
            Secure, transparent, and refundable event tickets on the blockchain
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8 flex justify-center">
          {!account ? (
            <button
              onClick={connectWallet}
              className="group relative overflow-hidden px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6" />
                <span className="font-semibold">Connect Wallet</span>
              </div>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-lg border border-white/20">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span className="font-mono">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={mintTicket}
            disabled={!account || isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Ticket className="w-5 h-5" />
            {isLoading ? "Minting..." : "Mint New Ticket"}
          </button>

          <button
            onClick={() => fetchNFTs(account)}
            disabled={!account || isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Tickets
          </button>

          <button
            onClick={cancelEvent}
            disabled={
              !account ||
              isLoading ||
              isCancelling ||
              transferHistory.length === 0
            }
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Ban className="w-5 h-5" />
            {isRefunding ? "Processing Refunds..." : "Cancel & Refund"}
          </button>
        </div>

        {/* Transfer History */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Transfer History</h2>
          <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
            {transferHistory.length > 0 ? (
              <div className="space-y-4">
                {transferHistory.map((transfer, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          Ticket Transfer #{index + 1}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          To: {transfer.buyerAddress.slice(0, 6)}...
                          {transfer.buyerAddress.slice(-4)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-medium">
                          {transfer.price} APT
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(transfer.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">
                No transfers recorded yet
              </p>
            )}
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-xl">{nft.name}</h3>
                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm">
                  {nft.eventDetails.ticketType}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{nft.eventDetails.eventName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Tag className="w-4 h-4" />
                  <span>Seat: {nft.eventDetails.seatNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Star className="w-4 h-4" />
                  <span>{nft.eventDetails.perks.join(", ")}</span>
                </div>
              </div>

              <button
                onClick={() => viewNFTDetails(nft)}
                disabled={isNFTTransferred(nft.tokenId)}
                className={`w-full px-4 py-3 rounded-lg transform transition-all duration-300 hover:scale-105 
    ${
      isNFTTransferred(nft.tokenId)
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
    }`}
              >
                {isNFTTransferred(nft.tokenId)
                  ? "Transferred"
                  : "View & Transfer"}
              </button>
            </div>
          ))}
        </div>

        {/* NFT Details Modal */}
        {selectedNFT && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-white/10 p-8 rounded-2xl max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedNFT.name}</h2>
                <button
                  onClick={() => {
                    setSelectedNFT(null);
                    setBuyerAddress("");
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* NFT Details Section */}
              <div className="space-y-4 mb-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Event Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Event Name:</span>
                      <span className="font-medium">
                        {selectedNFT.eventDetails.eventName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seat:</span>
                      <span className="font-medium">
                        {selectedNFT.eventDetails.seatNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="font-medium">
                        {selectedNFT.eventDetails.ticketType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Perks:</span>
                      <span className="font-medium text-right">
                        {selectedNFT.eventDetails.perks.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mint Time:</span>
                      <span className="font-medium">
                        {selectedNFT.eventDetails.mintTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="font-medium">{TICKET_PRICE} APT</span>
                    </div>
                  </div>
                </div>

                {/* Transfer Section */}
                <div className="border-t border-white/10 pt-6">
                  <h3 className="font-semibold mb-4">Transfer Ticket</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter recipient's wallet address"
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                    />

                    <button
                      onClick={() => transferNFT(selectedNFT, buyerAddress)}
                      disabled={isLoading || !buyerAddress}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Transferring...</span>
                        </>
                      ) : (
                        <>
                          <Ticket className="w-5 h-5" />
                          <span>Transfer Ticket</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {nfts.length === 0 && account && (
          <div className="text-center py-12">
            <div className="bg-white/5 rounded-xl p-8 max-w-md mx-auto">
              <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No Tickets Found</h3>
              <p className="text-gray-400 mb-6">
                Start by minting your first event ticket NFT
              </p>
              <button
                onClick={mintTicket}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg transform transition-all duration-300 hover:scale-105"
              >
                Mint First Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTTicketSystem;
