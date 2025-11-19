// Python Execution Service for Cloudflare Workers
// This service communicates with the Cloud Run Python Executor

export interface PythonExecutionRequest {
  code: string;
  args?: any[];
}

export interface PythonExecutionResponse {
  success: boolean;
  stdout: string;
  stderr: string;
  result?: any;
  error?: string;
}

export class PythonExecutionService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Execute Python code on the Cloud Run executor
   * @param code - Python code to execute
   * @param args - Arguments to pass to the code
   * @returns Execution results
   */
  async executePython(code: string, args?: any[]): Promise<PythonExecutionResponse> {
    try {
      const request: PythonExecutionRequest = { code, args };
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Add authentication if API key is provided
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      
      const response = await fetch(`${this.baseUrl}/execute`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error(`Python execution failed: ${response.status} ${response.statusText}`);
      }
      
      const result: PythonExecutionResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error executing Python code:', error);
      throw error;
    }
  }

  /**
   * Fetch an Identity Token for authentication (when running in Cloud Run environment)
   * @returns Identity token
   */
  async fetchIdentityToken(): Promise<string> {
    try {
      // This would be implemented when running in a secure environment
      // For now, we'll return a placeholder
      console.warn('Identity token fetching not implemented');
      return '';
    } catch (error) {
      console.error('Error fetching identity token:', error);
      throw error;
    }
  }
}