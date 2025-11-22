// packages/workers/tool-executor/src/tools/ncbi.ts - NCBI API Client for Scientific Research
export class NCBIClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
  }

  /**
   * Search for scientific papers on NCBI
   * @param term - The search term
   * @returns Search results with paper IDs
   */
  async searchPapers(term: string): Promise<any> {
    try {
      // Construct the URL with query parameters
      const encodedTerm = encodeURIComponent(term);
      const url = `${this.baseUrl}?term=${encodedTerm}&retmode=json&retmax=20`;
      
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
        throw new Error(`NCBI API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('NCBI API request timeout');
      }
      throw new Error(`Failed to search papers from NCBI: ${error.message}`);
    }
  }
}