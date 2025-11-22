export interface MarketplaceListing {
    listingId: string;
    agentId: string;
    ownerId: string; // Solana wallet address
    name: string;
    description: string;
    pricePerDay: number; // In $AXIOM
    pricePerUse: number; // In $AXIOM
    capabilities: string[];
    reputation: number;
    status: 'available' | 'rented' | 'inactive';
    createdAt: number; // Timestamp
    updatedAt: number; // Timestamp
    rentalTerms: {
        minRentalDays: number;
        maxRentalDays: number;
        autoRenew: boolean;
        cancellationPolicy: string;
    };
    metadata: {
        category: string;
        tags: string[];
        previewImage: string;
        demoLink?: string;
    };
}

export interface RentalAgreement {
    agreementId: string;
    listingId: string;
    renterId: string; // Solana wallet address
    startDate: number;
    endDate: number;
    totalPrice: number;
    status: 'active' | 'completed' | 'cancelled';
    escrowAddress: string; // Solana PDA for escrow
}
