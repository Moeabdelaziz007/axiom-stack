// Solana & Web3 Types for Agent UI

export interface AgentWallet {
    address: string;
    solBalance: number;
    tokens: TokenBalance[];
    totalValueUSD: number;
}

export interface TokenBalance {
    mint: string;
    symbol: string;
    name?: string;
    amount: number;
    decimals: number;
    usdValue?: number;
    logoUri?: string;
}

export interface OnChainTransaction {
    signature: string;
    slot: number;
    blockTime: number;
    timestamp: number;
    type: 'transfer' | 'trade' | 'memo' | 'swap' | 'unknown';
    status: 'success' | 'failed';
    fee: number;
    memo?: string;
    amount?: number;
    fromAddress?: string;
    toAddress?: string;
}

export interface AxiomMemo {
    version: string;
    reasoningHash: string;
    decisionId: string;
    tradeType?: 'buy' | 'sell' | 'swap';
    confidence?: number;
}

export const parseAxiomMemo = (memoString: string): AxiomMemo | null => {
    try {
        // Format: AXIOM:v1:reasoningHash:decisionId
        const parts = memoString.split(':');
        if (parts[0] !== 'AXIOM') return null;

        return {
            version: parts[1],
            reasoningHash: parts[2],
            decisionId: parts[3],
        };
    } catch {
        return null;
    }
};

export const formatSolAmount = (lamports: number): string => {
    return (lamports / 1_000_000_000).toFixed(4);
};

export const shortenAddress = (address: string, chars: number = 4): string => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
