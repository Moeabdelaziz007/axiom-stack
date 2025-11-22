// packages/workers/tool-executor/src/tools/clinicaltrials.ts - ClinicalTrials.gov API Client for Health Data
export class ClinicalTrialsClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://clinicaltrials.gov/api/v2/studies';
  }

  /**
   * Search for clinical trials
   * @param query - Search query terms
   * @param count - Number of results to return (default: 20)
   * @returns Clinical trials data
   */
  async searchTrials(query: string, count: number = 20): Promise<any> {
    try {
      // Construct the URL with query parameters
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.baseUrl}?query.term=${encodedQuery}&count=${count}`;
      
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
        throw new Error(`ClinicalTrials.gov API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('ClinicalTrials.gov API request timeout');
      }
      throw new Error(`Failed to search trials from ClinicalTrials.gov: ${error.message}`);
    }
  }

  /**
   * Get detailed information about a specific clinical trial
   * @param nctId - NCT ID of the clinical trial
   * @returns Detailed clinical trial data
   */
  async getTrial(nctId: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/${nctId}`;
      
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
        throw new Error(`ClinicalTrials.gov API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('ClinicalTrials.gov API request timeout');
      }
      throw new Error(`Failed to get trial from ClinicalTrials.gov: ${error.message}`);
    }
  }
}