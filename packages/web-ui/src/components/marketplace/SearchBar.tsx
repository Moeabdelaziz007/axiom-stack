import React from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    return (
        <div className="relative w-full md:w-96">
            <input
                type="text"
                placeholder="Find skill (e.g. Marketing)..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-axiom-dark border border-gray-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-axiom-cyan"
            />
            <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    );
};
