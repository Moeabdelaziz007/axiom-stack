import React, { useState } from 'react';
import { Dna, CheckCircle, Share2, Wallet, Code, Shield } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import PaymentModal from '@/components/payments/PaymentModal';
import DNATreePreview from '@/components/common/DNATreePreview';

interface MintStepProps {
    agentData: any;
    onBack: () => void;
}

const MintStep: React.FC<MintStepProps> = ({ agentData, onBack }) => {
    const { status, connectWallet } = useWallet();
    const connected = status === 'connected';
    const [isMinting, setIsMinting] = useState(false);
    const [isMinted, setIsMinted] = useState(false);
    const [royaltyFee, setRoyaltyFee] = useState(5);
    const [showPayment, setShowPayment] = useState(false);
    const [mintedDNA, setMintedDNA] = useState<any>(null);

    const handleMintClick = () => {
        if (!connected) {
            connectWallet();
            return;
        }
        setShowPayment(true);
    };

    const handlePaymentSuccess = async () => {
        setShowPayment(false); // Close the payment modal
        setIsMinting(true);

        // --- AIX DNA GENERATION ---
        const finalAIXDNA = {
            "META": {
                "dnaId": "AX-DNA-" + Date.now(),
                "version": "1.0.0",
                "governanceProtocol": "v1.2-SafeAgent",
                "timestamp": new Date().toISOString()
            },
            "MAIN_AGENT": {
                "name": agentData.name,
                "role": agentData.role,
                "genome": agentData.genome || "Custom Genome", // Fallback if not set
            },
            "TRAITS": {
                "riskTolerance": agentData.traits?.riskTolerance || 0.5,
                "tone": agentData.traits?.tone || "professional",
                "postingFrequency": agentData.traits?.postingFrequency || "medium"
            },
            "REASONING_PROTOCOL": agentData.reasoningProtocol,
            "COLLABORATION_LAYER": {
                "synchronizer": "QuantumSynchronizer",
                "peers": agentData.collaborationLayer || []
            },
            "TOOLS": agentData.tools || []
        };

        console.log("🧬 GENERATED AIX DNA:", JSON.stringify(finalAIXDNA, null, 2));
        setMintedDNA(finalAIXDNA);

        // Simulate minting process (IPFS upload + Blockchain interaction)
        setTimeout(() => {
            setIsMinting(false);
            setIsMinted(true);
        }, 3000);
    };

    if (isMinted) {
        return (
            <div className="text-center py-12 animate-fade-in-up">
                <div className="w-24 h-24 bg-axiom-success/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-axiom-success shadow-[0_0_30px_rgba(0,255,148,0.4)]">
                    <CheckCircle className="w-12 h-12 text-axiom-success" />
                </div>
                <h2 className="text-4xl font-orbitron text-white mb-4">Agent Deployed Successfully!</h2>
                <p className="text-xl text-white/70 font-rajdhani mb-8 max-w-2xl mx-auto">
                    <span className="text-cyber-cyan font-bold">{agentData.name}</span> has been minted as a sovereign NFT on Solana.
                    <br />
                    <span className="text-sm text-white/50">DNA Hash: {mintedDNA?.META?.dnaId}</span>
                </p>

                <div className="flex justify-center gap-4">
                    <button className="px-8 py-4 bg-cyber-cyan text-dark-void font-bold rounded-xl hover:bg-cyber-cyan/90 transition shadow-glow-cyan font-orbitron">
                        View in Dashboard
                    </button>
                    <button className="px-8 py-4 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition flex items-center gap-2 font-orbitron">
                        <Share2 className="w-5 h-5" />
                        Share to X
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                amount={0.05}
                currency="SOL"
                itemName={`Mint DNA: ${agentData.name}`}
                onSuccess={handlePaymentSuccess}
            />

            <h2 className="text-3xl font-orbitron text-white mb-6">5. Mint & Deploy</h2>
            <p className="text-white/60 mb-8 font-rajdhani">
                Finalize your agent, set royalty fees, and mint its DNA as a sovereign NFT.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Agent Preview Card */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 border-2 border-cyber-cyan/30 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-cyan to-neon-purple"></div>

                        {/* Holographic Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        <div className="h-40 bg-dark-void/50 rounded-xl mb-6 flex items-center justify-center border border-white/10 relative overflow-hidden">
                            <Dna className="w-16 h-16 text-cyber-cyan animate-pulse-slow" />
                            <div className="absolute inset-0 bg-[url('/grid.png')] opacity-20"></div>
                        </div>

                        <h3 className="text-2xl font-orbitron text-white mb-1">{agentData.name}</h3>
                        <p className="text-neon-purple font-rajdhani text-sm mb-4">{agentData.role}</p>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                                <span className="text-white/50">Risk Tolerance</span>
                                <span className="text-white font-mono">{(agentData.traits?.riskTolerance * 100 || 50).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                                <span className="text-white/50">Tone</span>
                                <span className="text-white font-mono capitalize">{agentData.traits?.tone || 'Standard'}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                                <span className="text-white/50">Collaborators</span>
                                <span className="text-white font-mono">{agentData.collaborationLayer?.length || 0} Agents</span>
                            </div>
                        </div>

                        <div className="text-xs text-center text-white/30 font-mono flex items-center justify-center gap-1">
                            <Code className="w-3 h-3" />
                            AIX DNA READY
                        </div>
                    </div>
                </div>

                {/* Right: Minting Configuration */}
                <div className="lg:col-span-2 space-y-6">

                    {/* DNA Structure Preview */}
                    <DNATreePreview agentData={agentData} />
                    {/* Royalty Settings */}
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-orbitron text-white mb-4">Ownership & Royalties</h3>
                        <p className="text-sm text-white/60 mb-6 font-rajdhani">
                            As the creator, you earn royalties whenever this agent is rented or traded in the marketplace.
                        </p>

                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-rajdhani text-white/80">Royalty Fee</label>
                                <span className="text-sm font-mono text-axiom-success">{royaltyFee}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="15"
                                step="0.5"
                                value={royaltyFee}
                                onChange={(e) => setRoyaltyFee(parseFloat(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-green"
                            />
                            <div className="flex justify-between text-xs text-white/40 mt-2 font-rajdhani">
                                <span>0% (Public Good)</span>
                                <span>15% (Max)</span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                            <span className="text-sm text-white/70 font-rajdhani">Estimated Minting Cost</span>
                            <span className="text-lg font-mono text-white">0.05 SOL</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4">
                        {!connected ? (
                            <button
                                onClick={connectWallet}
                                className="w-full py-4 bg-neon-purple/20 border border-neon-purple text-neon-purple font-bold rounded-xl hover:bg-neon-purple/30 transition flex items-center justify-center gap-2 font-orbitron"
                            >
                                <Wallet className="w-5 h-5" />
                                Connect Wallet to Mint
                            </button>
                        ) : (
                            <button
                                onClick={handleMintClick}
                                disabled={isMinting}
                                className="w-full py-4 bg-gradient-to-r from-cyber-cyan to-holo-blue text-dark-void font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-orbitron relative overflow-hidden"
                            >
                                {isMinting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-dark-void border-t-transparent rounded-full animate-spin"></span>
                                        Minting DNA Sequence...
                                    </span>
                                ) : (
                                    'MINT DNA NFT & DEPLOY'
                                )}
                            </button>
                        )}

                        <button
                            onClick={onBack}
                            disabled={isMinting}
                            className="w-full py-3 text-white/50 hover:text-white transition font-rajdhani"
                        >
                            Cancel & Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MintStep;
