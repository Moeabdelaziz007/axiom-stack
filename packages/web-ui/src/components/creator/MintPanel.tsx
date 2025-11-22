import React, { useState } from 'react';

interface MintPanelProps {
    onMint: (royalties: number) => void;
    isMinting: boolean;
}

export const MintPanel: React.FC<MintPanelProps> = ({ onMint, isMinting }) => {
    const [royalties, setRoyalties] = useState(5);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
            <h3 className="text-xl font-bold text-white">Mint Template</h3>

            <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                    Creator Royalties ({royalties}%)
                </label>
                <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={royalties}
                    onChange={(e) => setRoyalties(parseFloat(e.target.value))}
                    className="w-full accent-axiom-cyan"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>10%</span>
                </div>
            </div>

            <div className="bg-black/30 p-4 rounded-lg text-sm text-gray-400">
                <p>Minting this template will create a Master Edition NFT on Solana. You will earn royalties whenever an agent is instantiated from this template.</p>
            </div>

            <button
                onClick={() => onMint(royalties)}
                disabled={isMinting}
                className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${isMinting
                        ? 'bg-gray-700 text-gray-500 cursor-wait'
                        : 'bg-gradient-to-r from-axiom-cyan to-purple-600 text-white hover:shadow-lg hover:shadow-axiom-cyan/20'
                    }`}
            >
                {isMinting ? 'MINTING...' : 'MINT GENE TEMPLATE'}
            </button>
        </div>
    );
};
