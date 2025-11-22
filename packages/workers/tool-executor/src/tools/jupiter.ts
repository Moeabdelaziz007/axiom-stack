// packages/workers/tool-executor/src/tools/jupiter.ts - Jupiter API Client for Crypto Market Data
export class JupiterClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://lite-api.jup.ag/price/v3';
  }

  /**
   * Get price quote from Jupiter API
   * @param inputMint - The mint address of the input token
   * @param outputMint - The mint address of the output token
   * @param amount - The amount of input token to swap
   * @returns Price quote data
   */
  async getPrice(inputMint: string, outputMint: string, amount: number): Promise<any> {
    try {
      // For price API, we only need the input mint
      const url = `${this.baseUrl}?ids=${inputMint}`;
      
      // Fetch with timeout to respect Cloudflare Free Tier limits
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Jupiter API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Jupiter API request timeout');
      }
      throw new Error(`Failed to get price from Jupiter: ${error.message}`);
    }
  }
}