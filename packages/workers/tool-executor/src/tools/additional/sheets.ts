// packages/workers/tool-executor/src/tools/additional/sheets.ts - Google Sheets Integration

// Define types for Google Sheets responses
interface SheetsConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  spreadsheetId: string;
}

interface SheetsTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SheetData {
  range: string;
  majorDimension: string;
  values: any[][];
}

export class SheetsClient {
  private config: SheetsConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(config: SheetsConfig) {
    this.config = config;
  }

  /**
   * Get access token for Google Sheets API
   * @returns Promise<string> - Access token
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      // Exchange refresh token for access token
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.config.refreshToken,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sheets auth error: ${errorText}`);
      }

      const tokenData: SheetsTokenResponse = await response.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // Refresh 1 minute early

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Sheets access token:', error);
      throw error;
    }
  }

  /**
   * Get data from a Google Sheet
   * @param range - Cell range (e.g., "Sheet1!A1:B10")
   * @returns Promise<SheetData> - Sheet data
   */
  async getSheetData(range: string): Promise<SheetData> {
    try {
      const token = await this.getAccessToken();
      const spreadsheetId = this.config.spreadsheetId;
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sheets get data error: ${errorText}`);
      }

      const data: SheetData = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting sheet data:', error);
      throw error;
    }
  }

  /**
   * Update data in a Google Sheet
   * @param range - Cell range (e.g., "Sheet1!A1:B10")
   * @param values - 2D array of values to write
   * @returns Promise<any> - Update response
   */
  async updateSheetData(range: string, values: any[][]): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const spreadsheetId = this.config.spreadsheetId;
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            range: range,
            majorDimension: 'ROWS',
            values: values
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sheets update data error: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating sheet data:', error);
      throw error;
    }
  }

  /**
   * Append data to a Google Sheet
   * @param range - Cell range (e.g., "Sheet1!A1:B10")
   * @param values - 2D array of values to append
   * @returns Promise<any> - Append response
   */
  async appendSheetData(range: string, values: any[][]): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const spreadsheetId = this.config.spreadsheetId;
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            range: range,
            majorDimension: 'ROWS',
            values: values
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sheets append data error: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error appending sheet data:', error);
      throw error;
    }
  }

  /**
   * Create a new spreadsheet
   * @param title - Title of the new spreadsheet
   * @returns Promise<string> - Spreadsheet ID
   */
  async createSpreadsheet(title: string): Promise<string> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        'https://sheets.googleapis.com/v4/spreadsheets',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            properties: {
              title: title
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sheets create error: ${errorText}`);
      }

      const result = await response.json();
      return result.spreadsheetId;
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      throw error;
    }
  }

  /**
   * Get spreadsheet metadata
   * @returns Promise<any> - Spreadsheet metadata
   */
  async getSpreadsheetInfo(): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const spreadsheetId = this.config.spreadsheetId;
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sheets info error: ${errorText}`);
      }

      const info = await response.json();
      return info;
    } catch (error) {
      console.error('Error getting spreadsheet info:', error);
      throw error;
    }
  }
}