'use client';

import { useState, useEffect } from 'react';
import { MarketplaceAgentCard } from '@/components/agents/MarketplaceAgentCard';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { FilterPanel } from '@/components/marketplace/FilterPanel';
// import { useMarketplace } from '@/hooks/useMarketplace'; // TODO: Implement hook

// Mock data for development
const MOCK_LISTINGS = [
    {
        listingId: '1',
        agentId: 'agent_1',
        ownerId: 'owner_1',
        name: 'Social-Bot 3000',
        description: 'Autonomous social media manager. Analyzes trends and posts viral content.',
        pricePerDay: 500,
        pricePerUse: 50,
        capabilities: ['Twitter', 'Growth', 'Content'],
        reputation: 4.8,
        status: 'available',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        rentalTerms: { minRentalDays: 1, maxRentalDays: 30, autoRenew: false, cancellationPolicy: 'flexible' },
        metadata: { category: 'marketing', tags: ['social', 'bot'], previewImage: '/agents/social-bot.jpg' }
    },
    {
        listingId: '2',
        agentId: 'agent_2',
        ownerId: 'owner_2',
        name: 'Dev-Zero',
        description: 'Writes bug-free smart contracts. Connected to GitHub. Verified audits.',
        pricePerDay: 1200,
        pricePerUse: 100,
        capabilities: ['Solana', 'Rust', 'Security'],
        reputation: 5.0,
        status: 'available',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        rentalTerms: { minRentalDays: 7, maxRentalDays: 90, autoRenew: true, cancellationPolicy: 'strict' },
        metadata: { category: 'development', tags: ['coding', 'smart-contracts'], previewImage: '/agents/dev-zero.jpg' }
    },
    {
        listingId: '3',
        agentId: 'agent_3',
        ownerId: 'owner_3',
        name: 'Lex-Machina',
        description: 'Drafts NDAs, Service Agreements, and reviews tokenomics for compliance.',
        pricePerDay: 800,
        pricePerUse: 80,
        capabilities: ['Contracts', 'Legal', 'Compliance'],
        reputation: 4.9,
        status: 'rented',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        rentalTerms: { minRentalDays: 1, maxRentalDays: 14, autoRenew: false, cancellationPolicy: 'moderate' },
        metadata: { category: 'legal', tags: ['law', 'documents'], previewImage: '/agents/lex-machina.jpg' }
    }
];

export default function MarketplacePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [listings, setListings] = useState<any[]>(MOCK_LISTINGS); // Use mock data initially

    const handleRent = (listing: any) => {
        console.log('Renting agent:', listing.name);
        // TODO: Implement rental modal and smart contract interaction
    };

    const filteredListings = listings.filter(listing => {
        if (searchQuery && !listing.name.toLowerCase().includes(searchQuery.toLowerCase()) && !listing.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        // Add more filter logic here
        return true;
    });

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header>
                    <h1 className="text-4xl font-bold mb-2">GIG ECONOMY</h1>
                    <p className="text-gray-400">Rent Autonomous Workforce</p>
                </header>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <SearchBar onSearch={setSearchQuery} />
                    <FilterPanel onFilterChange={setFilters} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                        <MarketplaceAgentCard
                            key={listing.listingId}
                            listing={listing}
                            onRent={handleRent}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
