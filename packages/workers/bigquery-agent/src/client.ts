// packages/workers/bigquery-agent/src/client.ts - BigQuery REST API Client
import { DurableObjectState } from '@cloudflare/workers-types';

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
  statistics?: {
    query: {
      totalBytesProcessed: string;
    };
  };
}

interface BigQueryInsertResponse {
  kind: string;
  insertErrors?: Array<{
    index: number;
    errors: Array<{
      reason: string;
      location: string;
      debugInfo: string;
      message: string;
    }>;
  }>;
}

export class BigQueryClient {
  private projectId: string;
  private authWorker: any;

  constructor(projectId: string, authWorker: any) {
    this.projectId = projectId;
    this.authWorker = authWorker;
  }

  /**
   * Get Google Cloud access token from Auth Worker
   * @returns Promise<string> - Access token
   */
  private async getAccessToken(): Promise<string> {
    try {
      const response = await this.authWorker.fetch('http://auth-worker/generate-jwt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: 'bigquery-agent',
          claims: {
            scope: 'https://www.googleapis.com/auth/bigquery'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Auth Worker error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  /**
   * Insert rows into a BigQuery table
   * @param datasetId - Dataset ID
   * @param tableId - Table ID
   * @param rows - Array of rows to insert
   * @returns Promise<any> - Insert response
   */
  async insertRows(datasetId: string, tableId: string, rows: any[]): Promise<any> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://bigquery.googleapis.com/bigquery/v2/projects/${this.projectId}/datasets/${datasetId}/tables/${tableId}/insertAll`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rows: rows.map(row => ({ json: row }))
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`BigQuery insert error: ${errorText}`);
      }

      const result: BigQueryInsertResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error inserting rows:', error);
      throw error;
    }
  }

  /**
   * Run a BigQuery SQL query
   * @param sql - SQL query to execute
   * @param useLegacySql - Whether to use legacy SQL syntax
   * @returns Promise<any[]> - Query results
   */
  async runQuery(sql: string, useLegacySql: boolean = false): Promise<any[]> {
    try {
      // Check query size to prevent exceeding free tier limits
      // This is a simple estimation - in practice, you'd want to use dryRun to get exact bytes
      const querySizeEstimate = new Blob([sql]).size;
      if (querySizeEstimate > 1024 * 1024 * 1024) { // 1GB limit for safety
        throw new Error('Query size exceeds 1GB limit. Please optimize your query.');
      }

      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://bigquery.googleapis.com/bigquery/v2/projects/${this.projectId}/queries`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: sql,
            useLegacySql: useLegacySql,
            dryRun: false // Set to true to estimate bytes processed without running
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`BigQuery query error: ${errorText}`);
      }

      const result: BigQueryJobResponse = await response.json();
      
      // Check if query exceeded free tier limits
      if (result.statistics && result.statistics.query) {
        const bytesProcessed = parseInt(result.statistics.query.totalBytesProcessed, 10);
        if (bytesProcessed > 1024 * 1024 * 1024 * 1024) { // 1TB limit
          throw new Error('Query would exceed BigQuery free tier limit of 1TB per month');
        }
      }

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
      console.error('Error running query:', error);
      throw error;
    }
  }

  /**
   * Run a dry run to estimate query cost
   * @param sql - SQL query to estimate
   * @param useLegacySql - Whether to use legacy SQL syntax
   * @returns Promise<number> - Estimated bytes to be processed
   */
  async estimateQueryCost(sql: string, useLegacySql: boolean = false): Promise<number> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://bigquery.googleapis.com/bigquery/v2/projects/${this.projectId}/queries`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: sql,
            useLegacySql: useLegacySql,
            dryRun: true
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`BigQuery dry run error: ${errorText}`);
      }

      const result: BigQueryJobResponse = await response.json();
      
      if (result.statistics && result.statistics.query) {
        return parseInt(result.statistics.query.totalBytesProcessed, 10);
      }
      
      return 0;
    } catch (error) {
      console.error('Error estimating query cost:', error);
      throw error;
    }
  }
}