// packages/workers/tool-executor/src/tools/helius.ts - Helius RPC/API Client
export class HeliusClient {
    private baseUrl: string;
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = `https://mainnet.helius-rpc.com/?api-key=${this.apiKey}`;
    }

    /**
     * Get priority fee estimate for a transaction
     * Essential for ensuring transaction inclusion during congestion
     * @param accountKeys - Array of account keys involved in the transaction (optional)
     */
    async getPriorityFee(accountKeys: string[] = []): Promise<any> {
        // Default to a high-priority level request if no specific accounts provided
        const payload = {
            jsonrpc: '2.0',
            id: 'axiom-fee-check',
            method: 'getPriorityFeeEstimate',
            params: [
                {
                    accountKeys: accountKeys,
                    options: {
                        includeAllPriorityFeeLevels: true,
                    },
                },
            ],
        };

        return this.makeRpcRequest(payload);
    }

    /**
     * Get asset information using DAS API (Digital Asset Standard)
     * Useful for checking token mutability, freeze status, and metadata (Rug Check)
     * @param id - Asset ID (Mint address)
     */
    async getAssetInfo(id: string): Promise<any> {
        const payload = {
            jsonrpc: '2.0',
            id: 'axiom-asset-check',
            method: 'getAsset',
            params: {
                id: id,
            },
        };

        return this.makeRpcRequest(payload);
    }

    /**
     * Helper to make RPC requests
     */
    private async makeRpcRequest(payload: any): Promise<any> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Helius RPC error: ${response.status} ${response.statusText}`);
            }

            const data: any = await response.json();

            if (data.error) {
                throw new Error(`Helius RPC error: ${data.error.message}`);
            }

            return data.result;
        } catch (error: any) {
            console.error('Helius Request Failed:', error);
            throw new Error(`Helius request failed: ${error.message}`);
        }
    }
}
