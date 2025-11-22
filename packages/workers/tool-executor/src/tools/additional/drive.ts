// packages/workers/tool-executor/src/tools/additional/drive.ts - Google Drive Integration

// Define types for Google Drive responses
interface DriveConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface DriveTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
}

interface DriveListResponse {
  files: DriveFile[];
}

export class DriveClient {
  private config: DriveConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(config: DriveConfig) {
    this.config = config;
  }

  /**
   * Get access token for Google Drive API
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
        throw new Error(`Drive auth error: ${errorText}`);
      }

      const tokenData: DriveTokenResponse = await response.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // Refresh 1 minute early

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Drive access token:', error);
      throw error;
    }
  }

  /**
   * List files in Google Drive
   * @param query - Search query (optional)
   * @param limit - Maximum number of files to return (default: 100)
   * @returns Promise<DriveFile[]> - Array of files
   */
  async listFiles(query?: string, limit: number = 100): Promise<DriveFile[]> {
    try {
      const token = await this.getAccessToken();
      
      const q = query ? `q=${encodeURIComponent(query)}` : '';
      const url = `https://www.googleapis.com/drive/v3/files?${q}&pageSize=${limit}&fields=files(id,name,mimeType,createdTime,modifiedTime,size,webViewLink,webContentLink)`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Drive list files error: ${errorText}`);
      }

      const result: DriveListResponse = await response.json();
      return result.files || [];
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  /**
   * Upload a file to Google Drive
   * @param fileName - Name of the file
   * @param mimeType - MIME type of the file
   * @param data - File data (ArrayBuffer)
   * @param parentId - Parent folder ID (optional)
   * @returns Promise<DriveFile> - Uploaded file metadata
   */
  async uploadFile(fileName: string, mimeType: string, data: ArrayBuffer, parentId?: string): Promise<DriveFile> {
    try {
      const token = await this.getAccessToken();
      
      // Create metadata for the file
      const metadata: any = {
        name: fileName,
        mimeType: mimeType
      };
      
      if (parentId) {
        metadata.parents = [parentId];
      }
      
      // Create multipart request
      const boundary = '----AxiomIDDriveUploadBoundary';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;
      
      let multipartRequestBody = '';
      multipartRequestBody += delimiter;
      multipartRequestBody += 'Content-Type: application/json\r\n\r\n';
      multipartRequestBody += JSON.stringify(metadata);
      multipartRequestBody += delimiter;
      multipartRequestBody += `Content-Type: ${mimeType}\r\n\r\n`;
      
      const multipartBody = new Uint8Array(multipartRequestBody.length + data.byteLength + closeDelimiter.length);
      let offset = 0;
      
      // Add metadata part
      for (let i = 0; i < multipartRequestBody.length; i++) {
        multipartBody[offset++] = multipartRequestBody.charCodeAt(i);
      }
      
      // Add file data
      const dataView = new Uint8Array(data);
      for (let i = 0; i < dataView.length; i++) {
        multipartBody[offset++] = dataView[i];
      }
      
      // Add closing delimiter
      for (let i = 0; i < closeDelimiter.length; i++) {
        multipartBody[offset++] = closeDelimiter.charCodeAt(i);
      }
      
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Drive upload file error: ${errorText}`);
      }

      const file: DriveFile = await response.json();
      return file;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Download a file from Google Drive
   * @param fileId - ID of the file to download
   * @returns Promise<ArrayBuffer> - File data
   */
  async downloadFile(fileId: string): Promise<ArrayBuffer> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Drive download file error: ${errorText}`);
      }

      const data: ArrayBuffer = await response.arrayBuffer();
      return data;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  /**
   * Create a new folder in Google Drive
   * @param folderName - Name of the folder
   * @param parentId - Parent folder ID (optional)
   * @returns Promise<DriveFile> - Created folder metadata
   */
  async createFolder(folderName: string, parentId?: string): Promise<DriveFile> {
    try {
      const token = await this.getAccessToken();
      
      const metadata: any = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      };
      
      if (parentId) {
        metadata.parents = [parentId];
      }
      
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Drive create folder error: ${errorText}`);
      }

      const folder: DriveFile = await response.json();
      return folder;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }
}