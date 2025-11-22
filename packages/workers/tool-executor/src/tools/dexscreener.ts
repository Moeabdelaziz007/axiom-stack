// packages/workers/tool-executor/src/tools/dexscreener.ts - DexScreener API Client
export class DexScreenerClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'https://api.dexscreener.com/latest/dex';
    }

    /**
     * Get pair data by chain and pair address
     * @param chainId - Chain ID (e.g., 'solana')
     * @param pairAddress - Pair address
     */
    async getPair(chainId: string, pairAddress: string): Promise<any> {
        return this.makeRequest(`pairs/${chainId}/${pairAddress}`);
    }

    /**
     * Get pairs by token address
     * @param tokenAddress - Token mint address
     */
    async getPairsByToken(tokenAddress: string): Promise<any> {
        return this.makeRequest(`tokens/${tokenAddress}`);
    }

    /**
     * Search for pairs
     * @param query - Search query (token name, symbol, or address)
     */
    async searchPairs(query: string): Promise<any> {
        return this.makeRequest(`search?q=${query}`);
    }

    /**
     * Helper to make API requests
     */
    private async makeRequest(endpoint: string): Promise<any> {
        try {
            const url = `${this.baseUrl}/${endpoint}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`DexScreener API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error('DexScreener Request Failed:', error);
            throw new Error(`DexScreener request failed: ${error.message}`);
        }
    }
}
