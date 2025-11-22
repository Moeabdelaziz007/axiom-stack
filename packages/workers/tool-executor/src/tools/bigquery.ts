// packages/workers/tool-executor/src/tools/bigquery.ts - BigQuery Integration for Tool Executor
import { Hono } from 'hono';

// Define types for BigQuery responses
interface BigQueryJobResponse {
  kind: string;
  jobReference: {
    projectId: string;
    jobId: string;
    location: string;
  };
  totalRows: string;
  jobComplete: boolean;
  rows?: Array<{
    f: Array<{
      v: any;
    }>;
  }>;
  schema?: {
    fields: Array<{
      name: string;
      type: string;
      mode: string;
    }>;
  };
}

export class BigQueryClient {
  private projectId: string;
  private authWorker: any;
  private kvNamespace: any;

  constructor(projectId: string, authWorker: any, kvNamespace: any) {
    this.projectId = projectId;
    this.authWorker = authWorker;
    this.kvNamespace = kvNamespace;
  }

  /**
   * Run a BigQuery SQL query
   * @param sql - The SQL query to execute
   * @returns Promise<any[]> - Array of rows from the query result
   */
  async runQuery(sql: string): Promise<any[]> {
    try {
      // Check query size against free tier limit (1TB)
      const querySize = new Blob([sql]).size;
      const currentUsage = await this.getQueryUsage();
      
      if (currentUsage + querySize > 1024 * 1024 * 1024 * 1024) { // 1TB in bytes
        throw new Error('Query would exceed BigQuery free tier limit of 1TB');
      }
      
      // Update usage counter
      await this.updateQueryUsage(currentUsage + querySize);
      
      // Get access token from AuthWorker
      const tokenResponse = await this.authWorker.fetch('http://auth-worker/generate-jwt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: 'bigquery-service',
          claims: {
            scope: 'https://www.googleapis.com/auth/bigquery'
          }
        })
      });
      
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.token;
      
      // Execute BigQuery job
      const response = await fetch(
        `https://bigquery.googleapis.com/bigquery/v2/projects/${this.projectId}/queries`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: sql,
            useLegacySql: false
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`BigQuery API error: ${errorText}`);
      }
      
      const result: BigQueryJobResponse = await response.json();
      
      // Parse rows into JSON objects
      if (result.rows && result.schema) {
        const rows = result.rows.map(row => {
          const obj: any = {};
          result.schema!.fields.forEach((field, index) => {
            obj[field.name] = row.f[index].v;
          });
          return obj;
        });
        
        return rows;
      }
      
      return [];
    } catch (error) {
      console.error('Error running BigQuery query:', error);
      throw error;
    }
  }

  /**
   * Get current query usage from KV
   * @returns Promise<number> - Current usage in bytes
   */
  private async getQueryUsage(): Promise<number> {
    try {
      if (this.kvNamespace) {
        const usage = await this.kvNamespace.get('bigquery_usage', 'text');
        return usage ? parseInt(usage, 10) : 0;
      }
      return 0;
    } catch (error) {
      console.warn('Error getting BigQuery usage from KV:', error);
      return 0;
    }
  }

  /**
   * Update query usage in KV
   * @param usage - New usage value in bytes
   * @returns Promise<void>
   */
  private async updateQueryUsage(usage: number): Promise<void> {
    try {
      if (this.kvNamespace) {
        await this.kvNamespace.put('bigquery_usage', usage.toString(), { expirationTtl: 86400 }); // Expire in 24 hours
      }
    } catch (error) {
      console.warn('Error updating BigQuery usage in KV:', error);
    }
  }
}