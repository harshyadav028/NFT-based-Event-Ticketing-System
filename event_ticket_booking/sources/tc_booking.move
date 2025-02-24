module ticket_marketplace::event_tickets {
    use std::string::{Self, String};
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_token::token::{Self, TokenId};
    use aptos_std::table::{Self, Table};
    use std::vector;

    // Error codes
    const EINVALID_PRICE: u64 = 1;
    const EINVALID_QUANTITY: u64 = 2;
    const ETICKET_NOT_FOUND: u64 = 3;
    const ETICKET_ALREADY_SOLD: u64 = 4;
    const EUNAUTHORIZED: u64 = 5;
    const EMAX_RESALE_PRICE_EXCEEDED: u64 = 6;
    const EINVALID_ROYALTY: u64 = 7;
    const ENOT_LISTED: u64 = 8;
    const ETICKET_NOT_OWNED: u64 = 9;
    const ETICKET_ALREADY_REDEEMED: u64 = 10;

    // Constants for collection info
    const COLLECTION_NAME: vector<u8> = b"EVENT_TICKETS";
    const COLLECTION_DESCRIPTION: vector<u8> = b"Official Event Tickets";
    const COLLECTION_URI: vector<u8> = b"https://example.com";

    // Event types:
    // 1: Ticket Created, 2: Primary Purchase, 3: Listed for Resale,
    // 4: Resale Purchase, 5: Ticket Redeemed, 6: Listing Cancelled
    struct TicketEvent has copy, drop, store {
        event_type: u8,
        token_name: String,
        from: address,
        to: address,
        price: u64,
    }

    // Struct for Event Ticket NFT
    struct EventTicket has store {
        creator: address,
        collection_name: String,
        token_name: String,
        property_version: u64,
        price: u64,
        max_resale_price: u64,
        royalty_percentage: u64,
        event_time: u64,
        venue: String,
        is_valid: bool,
        current_owner: address,
        is_listed: bool,
        listing_price: u64,
    }

    struct MarketplaceData has key {
        tickets: Table<String, EventTicket>, // keyed by unique token name
        admin: address,
        event_log: vector<TicketEvent>,
    }

    // Helper: create a TokenId from token data
    fun create_token_id(creator: address, collection: String, token_name: String, property_version: u64): TokenId {
        let token_data_id = token::create_token_data_id(creator, collection, token_name);
        token::create_token_id(token_data_id, property_version)
    }

    // Initialize the marketplace (only the module address is allowed to do this)
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(account_addr == @ticket_marketplace, EUNAUTHORIZED);
        
        if (!exists<MarketplaceData>(account_addr)) {
            let marketplace_data = MarketplaceData {
                tickets: table::new(),
                admin: account_addr,
                event_log: vector::empty<TicketEvent>(),
            };
            move_to(account, marketplace_data);
        }
    }

    // Create tickets for an event.
    // For uniqueness, quantity must be exactly 1.
    public entry fun create_tickets(
        creator: &signer,
        token_name: String,
        description: String,
        quantity: u64,
        price: u64,
        max_resale_price: u64,
        royalty_percentage: u64,
        event_time: u64,
        venue: String,
    ) acquires MarketplaceData {
        assert!(price > 0, EINVALID_PRICE);
        // Enforce unique NFT per ticket
        assert!(quantity == 1, EINVALID_QUANTITY);
        assert!(royalty_percentage <= 100, EINVALID_ROYALTY);
        
        let creator_addr = signer::address_of(creator);
        let collection_name = string::utf8(COLLECTION_NAME);

        if (!token::check_collection_exists(creator_addr, string::utf8(COLLECTION_NAME))) {
            token::create_collection(
                creator,
                string::utf8(COLLECTION_NAME),
                string::utf8(COLLECTION_DESCRIPTION),
                string::utf8(COLLECTION_URI),
                1000,
                vector[false, false, false],
            );
        };

        let token_data_id = token::create_tokendata(
            creator,
            collection_name,
            token_name,
            description,
            quantity,
            string::utf8(COLLECTION_URI),
            creator_addr,
            royalty_percentage,
            0,
            token::create_token_mutability_config(&vector[false, false, false, false, false]),
            vector<String>[],
            vector<vector<u8>>[],
            vector<String>[],
        );

        token::mint_token(creator, token_data_id, 1);

        let marketplace_data = borrow_global_mut<MarketplaceData>(@ticket_marketplace);
        let ticket = EventTicket {
            creator: creator_addr,
            collection_name,
            token_name: token_name,
            property_version: 0,
            price,
            max_resale_price,
            royalty_percentage,
            event_time,
            venue,
            is_valid: true,
            current_owner: creator_addr,
            is_listed: false,
            listing_price: 0,
        };
        table::add(&mut marketplace_data.tickets, token_name, ticket);

        // Emit event: Ticket Created
        let event = TicketEvent {
            event_type: 1,
            token_name: token_name,
            from: creator_addr,
            to: creator_addr,
            price: price,
        };
        vector::push_back(&mut marketplace_data.event_log, event);
    }

    // Purchase a ticket directly from the primary sale.
    public entry fun purchase_ticket(
        buyer: &signer,
        seller: &signer,
        token_name: String,
    ) acquires MarketplaceData {
        let marketplace_data = borrow_global_mut<MarketplaceData>(@ticket_marketplace);
        
        assert!(table::contains(&marketplace_data.tickets, token_name), ETICKET_NOT_FOUND);
        let ticket = table::borrow_mut(&mut marketplace_data.tickets, token_name);
        // Ensure the ticket is still valid (has not been redeemed)
        assert!(ticket.is_valid, ETICKET_ALREADY_SOLD);
        
        let buyer_addr = signer::address_of(buyer);
        let seller_addr = signer::address_of(seller);
        // Verify that the seller is indeed the current owner
        assert!(ticket.current_owner == seller_addr, EUNAUTHORIZED);
        
        let token_id = create_token_id(
            ticket.creator,
            ticket.collection_name,
            ticket.token_name,
            ticket.property_version
        );
        
        coin::transfer<AptosCoin>(buyer, seller_addr, ticket.price);
        
        token::opt_in_direct_transfer(buyer, true);
        token::transfer(seller, token_id, buyer_addr, 1);
        ticket.current_owner = buyer_addr;

        // Emit event: Primary Purchase
        let event = TicketEvent {
            event_type: 2,
            token_name: token_name,
            from: seller_addr,
            to: buyer_addr,
            price: ticket.price,
        };
        vector::push_back(&mut marketplace_data.event_log, event);
    }

    // List a ticket for resale on the secondary marketplace.
    public entry fun list_for_resale(
        seller: &signer,
        token_name: String,
        price: u64,
    ) acquires MarketplaceData {
        let marketplace_data = borrow_global_mut<MarketplaceData>(@ticket_marketplace);
        
        assert!(table::contains(&marketplace_data.tickets, token_name), ETICKET_NOT_FOUND);
        let ticket = table::borrow_mut(&mut marketplace_data.tickets, token_name);
        let seller_addr = signer::address_of(seller);
        assert!(ticket.current_owner == seller_addr, EUNAUTHORIZED);
        // Enforce the maximum resale price to prevent exploitative markups
        assert!(price <= ticket.max_resale_price, EMAX_RESALE_PRICE_EXCEEDED);
        
        ticket.is_listed = true;
        ticket.listing_price = price;

        // Emit event: Listed for Resale
        let event = TicketEvent {
            event_type: 3,
            token_name: token_name,
            from: seller_addr,
            to: seller_addr,
            price: price,
        };
        vector::push_back(&mut marketplace_data.event_log, event);
    }

    // Purchase a ticket from the resale marketplace.
    public entry fun purchase_resale_ticket(
        buyer: &signer,
        seller: &signer,
        token_name: String,
    ) acquires MarketplaceData {
        let marketplace_data = borrow_global_mut<MarketplaceData>(@ticket_marketplace);
        
        assert!(table::contains(&marketplace_data.tickets, token_name), ETICKET_NOT_FOUND);
        let ticket = table::borrow_mut(&mut marketplace_data.tickets, token_name);
        assert!(ticket.is_listed, ENOT_LISTED);
        
        let buyer_addr = signer::address_of(buyer);
        let seller_addr = signer::address_of(seller);
        // Verify seller is the current owner
        assert!(ticket.current_owner == seller_addr, EUNAUTHORIZED);
        
        let token_id = create_token_id(
            ticket.creator,
            ticket.collection_name,
            ticket.token_name,
            ticket.property_version
        );
        
        // Calculate royalty and seller proceeds
        let royalty = (ticket.listing_price * ticket.royalty_percentage) / 100;
        let seller_amount = ticket.listing_price - royalty;
        
        coin::transfer<AptosCoin>(buyer, seller_addr, seller_amount);
        // Royalties go to the original creator (event organizer)
        coin::transfer<AptosCoin>(buyer, ticket.creator, royalty);
        
        token::opt_in_direct_transfer(buyer, true);
        token::transfer(seller, token_id, buyer_addr, 1);
        
        ticket.current_owner = buyer_addr;
        ticket.is_listed = false;
        ticket.listing_price = 0;

        // Emit event: Resale Purchase
        let event = TicketEvent {
            event_type: 4,
            token_name: token_name,
            from: seller_addr,
            to: buyer_addr,
            price: ticket.price,
        };
        vector::push_back(&mut marketplace_data.event_log, event);
    }

    // Redeem a ticket (mark it as used). Only the current owner can redeem.
    public entry fun redeem_ticket(
        user: &signer,
        token_name: String,
    ) acquires MarketplaceData {
        let marketplace_data = borrow_global_mut<MarketplaceData>(@ticket_marketplace);
        assert!(table::contains(&marketplace_data.tickets, token_name), ETICKET_NOT_FOUND);
        let ticket = table::borrow_mut(&mut marketplace_data.tickets, token_name);
        let user_addr = signer::address_of(user);
        assert!(ticket.current_owner == user_addr, ETICKET_NOT_OWNED);
        // Prevent double redemption
        assert!(ticket.is_valid, ETICKET_ALREADY_REDEEMED);
        ticket.is_valid = false;

        // Emit event: Ticket Redeemed
        let event = TicketEvent {
            event_type: 5,
            token_name: token_name,
            from: user_addr,
            to: user_addr,
            price: 0,
        };
        vector::push_back(&mut marketplace_data.event_log, event);
    }

    // Cancel a resale listing.
    public entry fun cancel_listing(
        seller: &signer,
        token_name: String,
    ) acquires MarketplaceData {
        let marketplace_data = borrow_global_mut<MarketplaceData>(@ticket_marketplace);
        assert!(table::contains(&marketplace_data.tickets, token_name), ETICKET_NOT_FOUND);
        let ticket = table::borrow_mut(&mut marketplace_data.tickets, token_name);
        let seller_addr = signer::address_of(seller);
        assert!(ticket.current_owner == seller_addr, ETICKET_NOT_OWNED);
        assert!(ticket.is_listed, ENOT_LISTED);
        ticket.is_listed = false;
        ticket.listing_price = 0;

        // Emit event: Listing Cancelled
        let event = TicketEvent {
            event_type: 6,
            token_name: token_name,
            from: seller_addr,
            to: seller_addr,
            price: 0,
        };
        vector::push_back(&mut marketplace_data.event_log, event);
    }

    // Validate a ticket – it must be valid (not redeemed) and the current time must be before the event.
    #[view]
    public fun validate_ticket(token_name: String): bool acquires MarketplaceData {
        let marketplace_data = borrow_global<MarketplaceData>(@ticket_marketplace);
        if (!table::contains(&marketplace_data.tickets, token_name)) {
            return false;
        };
        let ticket = table::borrow(&marketplace_data.tickets, token_name);
        ticket.is_valid && timestamp::now_seconds() < ticket.event_time
    }

    // Retrieve ticket details for front-end display.
    #[view]
    public fun get_ticket_details(
        token_name: String,
    ): (u64, u64, String, bool, address, bool, u64) acquires MarketplaceData {
        let marketplace_data = borrow_global<MarketplaceData>(@ticket_marketplace);
        assert!(table::contains(&marketplace_data.tickets, token_name), ETICKET_NOT_FOUND);
        let ticket = table::borrow(&marketplace_data.tickets, token_name);
        (
            ticket.price,
            ticket.event_time,
            ticket.venue,
            ticket.is_valid,
            ticket.current_owner,
            ticket.is_listed,
            ticket.listing_price
        )
    }
}
