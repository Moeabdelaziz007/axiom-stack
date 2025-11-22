// packages/workers/tool-executor/src/tools/cdc.ts - CDC API Client for Public Health Data
export class CDCClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://data.cdc.gov/resource';
  }

  /**
   * Search for health data from CDC datasets
   * @param datasetId - CDC dataset identifier
   * @param query - Search query terms
   * @param limit - Number of results to return (default: 20)
   * @returns Health data from CDC
   */
  async searchHealthData(datasetId: string, query: string = '', limit: number = 20): Promise<any> {
    try {
      // Construct the URL with query parameters
      let url = `${this.baseUrl}/${datasetId}.json?$limit=${limit}`;
      
      if (query) {
        const encodedQuery = encodeURIComponent(query);
        url += `&$where=${encodedQuery}`;
      }
      
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
        throw new Error(`CDC API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('CDC API request timeout');
      }
      throw new Error(`Failed to search health data from CDC: ${error.message}`);
    }
  }

  /**
   * Get detailed information about a specific health condition
   * @param condition - Health condition or disease name
   * @param location - Geographic location (optional)
   * @param limit - Number of results to return (default: 20)
   * @returns Detailed health condition data
   */
  async getHealthCondition(condition: string, location?: string, limit: number = 20): Promise<any> {
    try {
      // Example using a common CDC dataset for disease surveillance
      const datasetId = '9bhg-5n2z'; // This is an example dataset ID for disease surveillance
      
      let query = `condition='${condition}'`;
      if (location) {
        query += ` AND location='${location}'`;
      }
      
      const url = `${this.baseUrl}/${datasetId}.json?$where=${encodeURIComponent(query)}&$limit=${limit}`;
      
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
        throw new Error(`CDC API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('CDC API request timeout');
      }
      throw new Error(`Failed to get health condition data from CDC: ${error.message}`);
    }
  }
}