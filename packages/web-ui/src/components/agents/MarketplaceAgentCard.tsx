import React from 'react';
import { MarketplaceListing } from '@/types/marketplace'; // Assuming types are shared or duplicated

interface AgentCardProps {
  listing: MarketplaceListing;
  onRent: (listing: MarketplaceListing) => void;
}

export const MarketplaceAgentCard: React.FC<AgentCardProps> = ({ listing, onRent }) => {
  return (
    <div className="bg-axiom-dark border border-gray-800 rounded-xl overflow-hidden hover:border-axiom-cyan transition-colors">
      <div className="h-48 bg-gray-900 relative">
        {/* Placeholder for image */}
        <img
          src={listing.metadata.previewImage || '/placeholder-agent.png'}
          alt={listing.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-mono text-axiom-cyan">
          {listing.status.toUpperCase()}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-white">{listing.name}</h3>
          <span className="text-axiom-cyan font-mono">{listing.pricePerDay} AXM/day</span>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2">{listing.description}</p>

        <div className="flex flex-wrap gap-2">
          {listing.capabilities.slice(0, 3).map((cap, i) => (
            <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
              {cap}
            </span>
          ))}
        </div>

        <button
          onClick={() => onRent(listing)}
          disabled={listing.status !== 'available'}
          className={`w-full py-2 rounded-lg font-bold mt-2 ${listing.status === 'available'
            ? 'bg-axiom-cyan text-axiom-dark hover:bg-cyan-300'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
        >
          {listing.status === 'available' ? 'RENT AGENT' : 'UNAVAILABLE'}
        </button>
      </div>
    </div>
  );
};