// packages/workers/tool-executor/src/tools/birdeye.ts - Birdeye API Client
export class BirdeyeClient {
    private baseUrl: string;
    private apiKey: string;

    constructor(apiKey: string) {
        this.baseUrl = 'https://public-api.birdeye.so';
        this.apiKey = apiKey;
    }

    /**
     * Get token overview (price, liquidity, holders, etc.)
     * @param address - Token mint address
     */
    async getTokenOverview(address: string): Promise<any> {
        return this.makeRequest(`defi/token_overview?address=${address}`);
    }

    /**
     * Get trending tokens
     * @param limit - Number of tokens to return (default 10)
     */
    async getTrending(limit: number = 10): Promise<any> {
        return this.makeRequest(`defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=${limit}`);
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
                    'X-API-KEY': this.apiKey,
                    'Accept': 'application/json',
                    'x-chain': 'solana'
                }
            });

            if (!response.ok) {
                throw new Error(`Birdeye API error: ${response.status} ${response.statusText}`);
            }

            const data: any = await response.json();
            return data.data; // Birdeye wraps results in a 'data' field
        } catch (error: any) {
            console.error('Birdeye Request Failed:', error);
            throw new Error(`Birdeye request failed: ${error.message}`);
        }
    }
}
