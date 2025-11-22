'use client';

import { useState } from 'react';
import { TemplateBuilder } from '@/components/creator/TemplateBuilder';
import { PersonaEditor } from '@/components/creator/PersonaEditor';
import { ToolSelector } from '@/components/creator/ToolSelector';
import { MintPanel } from '@/components/creator/MintPanel';
import { AgentCard } from '@/components/agents/AgentCard';
import { AixAgent } from '@/lib/aixLoader';
import { NFTService } from '@/lib/nftService';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export default function CreatorStudioPage() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const [templateData, setTemplateData] = useState({
        name: '',
        description: '',
        systemPrompt: '',
        tone: 'professional',
        tools: [] as string[],
    });

    const [isMinting, setIsMinting] = useState(false);

    // Construct preview agent object
    const previewAgent: AixAgent = {
        id: 'preview_agent',
        name: templateData.name || 'New Agent',
        description: templateData.description || 'Agent description...',
        status: 'active',
        reputation: 0,
        loadFactor: 0,
        capabilities: templateData.tools.length > 0 ? templateData.tools : ['None'],
        // tasksCompleted: 0, // Removed for type compatibility
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        costPerAction: 0,
    };

    const handleMint = async (royalties: number) => {
        if (!wallet.connected) {
            alert('Please connect your wallet first!');
            return;
        }

        setIsMinting(true);
        try {
            const nftService = new NFTService(connection, wallet);

            // 1. Upload Metadata
            const metadata = {
                name: templateData.name,
                description: templateData.description,
                image: 'https://arweave.net/placeholder-image', // TODO: Generate dynamic image
                attributes: [
                    { trait_type: 'Tone', value: templateData.tone },
                    ...templateData.tools.map(tool => ({ trait_type: 'Tool', value: tool }))
                ],
                properties: {
                    files: [],
                    category: 'agent_template'
                }
            };

            // Mocking upload for now as we don't have a real file to upload
            // const uri = await nftService.uploadMetadata(metadata);
            const uri = 'https://mock-uri.com/metadata.json';

            console.log('Metadata uploaded:', uri);

            // 2. Mint NFT
            // const nft = await nftService.mintTemplateNFT(uri, templateData.name, royalties * 100);

            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('NFT Minted!');
            alert('Agent Template Minted Successfully! (Mock)');

        } catch (error) {
            console.error('Minting failed:', error);
            alert('Minting failed. See console for details.');
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-axiom-cyan to-purple-500">
                        THE GENE LAB
                    </h1>
                    <p className="text-gray-400">Design, Mint, and Monetize AI Agent Templates</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: The Lab (Builder) */}
                    <div className="lg:col-span-7 space-y-8 bg-gray-900/30 p-6 rounded-2xl border border-gray-800">
                        <TemplateBuilder
                            data={templateData}
                            onChange={(data) => setTemplateData({ ...templateData, ...data })}
                        />
                        <div className="h-px bg-gray-800" />
                        <PersonaEditor
                            data={templateData}
                            onChange={(data) => setTemplateData({ ...templateData, ...data })}
                        />
                        <div className="h-px bg-gray-800" />
                        <ToolSelector
                            selectedTools={templateData.tools}
                            onChange={(tools) => setTemplateData({ ...templateData, tools })}
                        />
                    </div>

                    {/* RIGHT: The Preview & Mint */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="sticky top-8">
                            <h3 className="text-sm font-mono text-gray-500 mb-4 uppercase tracking-wider">Live Preview</h3>

                            {/* Agent Card Preview */}
                            <div className="mb-8 transform scale-100 hover:scale-105 transition-transform duration-300">
                                <AgentCard
                                    agent={previewAgent}
                                    onClick={() => { }}
                                />
                            </div>

                            {/* Mint Panel */}
                            <MintPanel onMint={handleMint} isMinting={isMinting} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
