// Firestore Service for Cloudflare Workers
// Implements Firestore REST API integration with JWT authentication

// Define types for Firestore data
export interface FirestoreDocument {
  name?: string;
  fields: Record<string, any>;
  createTime?: string;
  updateTime?: string;
}

export interface FirestoreQueryFilter {
  field: string;
  operator: string;
  value: any;
}

// Define types for service account
export interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

export class FirestoreAuth {
  private serviceAccount: ServiceAccount;
  private projectId: string;
  private cachedToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(serviceAccountJson: string) {
    this.serviceAccount = JSON.parse(serviceAccountJson);
    this.projectId = this.serviceAccount.project_id;
  }

  /**
   * Generate a signed JWT for Firestore authentication
   * @returns Promise<string> - The signed JWT token
   */
  async generateJwt(): Promise<string> {
    // Check if we have a valid cached token
    if (this.cachedToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.cachedToken;
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600; // Token expires in 1 hour

    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const payload = {
      iss: this.serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/firebase.database',
      aud: this.serviceAccount.token_uri,
      exp: exp,
      iat: iat
    };

    // Encode header and payload as base64url
    const headerB64 = this.base64UrlEncode(JSON.stringify(header));
    const payloadB64 = this.base64UrlEncode(JSON.stringify(payload));

    // Create the signature input
    const signatureInput = `${headerB64}.${payloadB64}`;

    // Import the private key
    const privateKey = await this.importPrivateKey(this.serviceAccount.private_key);

    // Sign the input
    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
      { name: 'RSASSA-PKCS1-v1_5' },
      privateKey,
      encoder.encode(signatureInput)
    );

    // Encode the signature as base64url
    const signatureB64 = this.arrayBufferToBase64Url(signature);

    // Create the JWT
    const jwt = `${signatureInput}.${signatureB64}`;

    // Cache the token
    this.cachedToken = jwt;
    this.tokenExpiry = exp * 1000; // Convert to milliseconds

    return jwt;
  }

  /**
   * Get an access token for Firestore API
   * @returns Promise<string> - The access token
   */
  async getAccessToken(): Promise<string> {
    const jwt = await this.generateJwt();

    const response = await fetch(this.serviceAccount.token_uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Import private key for signing
   * @param pem - Private key in PEM format
   * @returns Promise<CryptoKey> - The imported private key
   */
  private async importPrivateKey(pem: string): Promise<CryptoKey> {
    // Remove PEM headers and whitespace
    const pemContents = pem
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s/g, '');

    // Convert base64 to binary
    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    // Import the key
    return await crypto.subtle.importKey(
      'pkcs8',
      binaryDer.buffer,
      { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
      false,
      ['sign']
    );
  }

  /**
   * Base64 URL encode a string
   * @param str - String to encode
   * @returns string - Base64 URL encoded string
   */
  private base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Convert ArrayBuffer to Base64 URL encoded string
   * @param buffer - ArrayBuffer to convert
   * @returns string - Base64 URL encoded string
   */
  private arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return this.base64UrlEncode(binary);
  }
}

export class FirestoreClient {
  private projectId: string;
  private baseUrl: string;
  private auth: FirestoreAuth;
  private kvNamespace: KVNamespace | null = null;

  constructor(projectId: string, auth: FirestoreAuth, kvNamespace?: KVNamespace) {
    this.projectId = projectId;
    this.auth = auth;
    this.baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
    this.kvNamespace = kvNamespace || null;
  }

  /**
   * Get a document from Firestore with KV caching
   * @param collection - Collection name
   * @param id - Document ID
   * @returns Promise<FirestoreDocument | null> - The document or null if not found
   */
  async getDocument(collection: string, id: string): Promise<FirestoreDocument | null> {
    try {
      // Generate cache key
      const cacheKey = `firestore_${collection}_${id}`;
      
      // Check KV cache first (Nano Optimization)
      if (this.kvNamespace) {
        try {
          const cachedDocument = await this.kvNamespace.get(cacheKey, 'json');
          if (cachedDocument) {
            console.log(`Returning cached document for ${collection}/${id}`);
            return cachedDocument as FirestoreDocument;
          }
        } catch (cacheError) {
          console.warn('KV cache read error:', cacheError);
        }
      }
      
      // If not in cache, fetch from Firestore
      const token = await this.auth.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/${collection}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to get document: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result in KV (Nano Optimization)
      if (this.kvNamespace) {
        try {
          await this.kvNamespace.put(cacheKey, JSON.stringify(data), { expirationTtl: 300 }); // Cache for 5 minutes
          console.log(`Cached document for ${collection}/${id}`);
        } catch (cacheError) {
          console.warn('KV cache write error:', cacheError);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  /**
   * Set (create/update) a document in Firestore
   * @param collection - Collection name
   * @param id - Document ID
   * @param data - Document data
   * @returns Promise<FirestoreDocument> - The updated document
   */
  async setDocument(collection: string, id: string, data: Record<string, any>): Promise<FirestoreDocument> {
    try {
      const token = await this.auth.getAccessToken();
      
      // Convert data to Firestore format
      const firestoreData = this.objectToFirestoreFields(data);
      
      const response = await fetch(`${this.baseUrl}/${collection}/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields: firestoreData })
      });

      if (!response.ok) {
        throw new Error(`Failed to set document: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Invalidate cache for this document
      if (this.kvNamespace) {
        try {
          const cacheKey = `firestore_${collection}_${id}`;
          await this.kvNamespace.delete(cacheKey);
          console.log(`Invalidated cache for ${collection}/${id}`);
        } catch (cacheError) {
          console.warn('KV cache delete error:', cacheError);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error setting document:', error);
      throw error;
    }
  }

  /**
   * Run a query against Firestore
   * @param collection - Collection name
   * @param filters - Query filters
   * @returns Promise<FirestoreDocument[]> - Array of matching documents
   */
  async runQuery(collection: string, filters: FirestoreQueryFilter[]): Promise<FirestoreDocument[]> {
    try {
      const token = await this.auth.getAccessToken();
      
      // Build the structured query
      const structuredQuery: any = {
        from: [{ collectionId: collection }],
        where: {
          compositeFilter: {
            op: 'AND',
            filters: filters.map(filter => ({
              fieldFilter: {
                field: { fieldPath: filter.field },
                op: filter.operator,
                value: this.valueToFirestoreValue(filter.value)
              }
            }))
          }
        }
      };

      const response = await fetch(`${this.baseUrl}:runQuery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ structuredQuery })
      });

      if (!response.ok) {
        throw new Error(`Failed to run query: ${response.status} ${response.statusText}`);
      }

      const results = await response.json();
      
      // Extract documents from results
      const documents: FirestoreDocument[] = [];
      for (const result of results) {
        if (result.document) {
          documents.push(result.document);
        }
      }
      
      return documents;
    } catch (error) {
      console.error('Error running query:', error);
      throw error;
    }
  }

  /**
   * Convert JavaScript object to Firestore fields format
   * @param obj - Object to convert
   * @returns Record<string, any> - Firestore fields format
   */
  private objectToFirestoreFields(obj: Record<string, any>): Record<string, any> {
    const fields: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      fields[key] = this.valueToFirestoreValue(value);
    }
    
    return fields;
  }

  /**
   * Convert JavaScript value to Firestore value format
   * @param value - Value to convert
   * @returns any - Firestore value format
   */
  private valueToFirestoreValue(value: any): any {
    if (value === null || value === undefined) {
      return { nullValue: null };
    }
    
    if (typeof value === 'string') {
      return { stringValue: value };
    }
    
    if (typeof value === 'boolean') {
      return { booleanValue: value };
    }
    
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        return { integerValue: value.toString() };
      } else {
        return { doubleValue: value };
      }
    }
    
    if (Array.isArray(value)) {
      return { 
        arrayValue: { 
          values: value.map(item => this.valueToFirestoreValue(item)) 
        } 
      };
    }
    
    if (typeof value === 'object') {
      return { 
        mapValue: { 
          fields: this.objectToFirestoreFields(value) 
        } 
      };
    }
    
    // Fallback for other types
    return { stringValue: String(value) };
  }
}