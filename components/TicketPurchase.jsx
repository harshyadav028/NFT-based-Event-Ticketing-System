"use client"
const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
const MODULE_ADDRESS = "0x44fee028bfacd874716790f849ad661cd9b2d4d68f657049bca01f04f76853f5";
const COLLECTION_NAME = "Collection1";
const TicketPurchase = ({ event, account }) => {
    const [seatNumber, setSeatNumber] = useState("");
  
    async function purchaseTicket() {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::event_ticketing_refresh::mint_ticket`,
        type_arguments: [],
        arguments: [
          account,
          MODULE_ADDRESS,
          event.event_id.toString(),
          seatNumber,
          (event.base_price * 1.5).toString(), // max resale price 50% above base
          "STANDARD",
          JSON.stringify([]),
          `${event.event_id}-${seatNumber}`
        ]
      };
  
      try {
        const txnResponse = await window.aptos.signAndSubmitTransaction(payload);
        await client.waitForTransaction(txnResponse.hash);
        alert("Ticket purchased successfully!");
      } catch (error) {
        console.error("Purchase failed:", error);
        alert("Failed to purchase ticket: " + error.message);
      }
    }
  
    return (
      <div className="ticket-purchase">
        <h3>Purchase Ticket for {event.name}</h3>
        <input 
          type="text" 
          value={seatNumber} 
          onChange={(e) => setSeatNumber(e.target.value)}
          placeholder="Enter seat number"
        />
        <button onClick={purchaseTicket}>Purchase Ticket</button>
      </div>
    );
  };

export default TicketPurchase;