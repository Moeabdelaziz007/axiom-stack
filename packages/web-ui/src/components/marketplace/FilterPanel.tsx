import React from 'react';

interface FilterPanelProps {
    onFilterChange: (filters: any) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
    return (
        <div className="flex gap-4">
            <select
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="bg-axiom-dark border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-axiom-cyan"
            >
                <option value="">All Categories</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="education">Education</option>
                <option value="development">Development</option>
            </select>

            <select
                onChange={(e) => onFilterChange({ sort: e.target.value })}
                className="bg-axiom-dark border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-axiom-cyan"
            >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="reputation">Reputation</option>
            </select>
        </div>
    );
};
