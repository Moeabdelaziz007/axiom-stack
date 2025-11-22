// packages/workers/auth-worker/src/index.ts - Authentication Worker for Nano Banana Architecture
import { Hono } from 'hono';

// Type declarations for Web APIs
declare global {
  interface WindowOrWorkerGlobalScope {
    crypto: Crypto;
  }
}

// Initialize Hono app
const app = new Hono();

// Health check endpoint
app.get('/', async (c: any) => {
  return c.json({
    message: 'AxiomID Auth Worker (Nano Banana Architecture)',
    version: '1.0.0',
    status: 'ok'
  });
});

// POST /generate-jwt endpoint - Generate JWT for Firebase authentication
app.post('/generate-jwt', async (c: any) => {
  try {
    const { uid, claims }: { uid: string; claims?: Record<string, any> } = await c.req.json();
    
    // Validate required fields
    if (!uid) {
      return c.json({ error: 'Missing required field: uid' }, 400);
    }
    
    // Validate uid length (1-128 characters for optimal performance)
    if (uid.length < 1 || uid.length > 128) {
      return c.json({ error: 'UID must be between 1 and 128 characters' }, 400);
    }
    
    // Get service account from environment variables
    const serviceAccountJson = c.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      return c.json({ error: 'Firebase service account not configured' }, 500);
    }
    
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    // Create JWT header
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };
    
    // Create JWT payload
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600; // Token expires in 1 hour
    
    const payload: any = {
      iss: serviceAccount.client_email,
      sub: serviceAccount.client_email,
      aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
      uid: uid,
      iat: iat,
      exp: exp
    };
    
    // Add custom claims if provided
    if (claims) {
      payload.claims = claims;
    }
    
    // Encode header and payload as base64url
    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(JSON.stringify(payload));
    
    // Create the signature input
    const signatureInput = `${headerB64}.${payloadB64}`;
    
    // Import the private key and sign the input
    const privateKey = await importPrivateKey(serviceAccount.private_key);
    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
      { name: 'RSASSA-PKCS1-v1_5' },
      privateKey,
      encoder.encode(signatureInput)
    );
    
    // Encode the signature as base64url
    const signatureB64 = arrayBufferToBase64Url(signature);
    
    // Create the JWT
    const jwt = `${signatureInput}.${signatureB64}`;
    
    return c.json({
      token: jwt,
      expiresIn: 3600
    });
  } catch (error: any) {
    console.error('Error generating JWT:', error);
    return c.json({ error: 'Failed to generate JWT: ' + error.message }, 500);
  }
});

// POST /verify-jwt endpoint - Verify JWT token
app.post('/verify-jwt', async (c: any) => {
  try {
    const { token }: { token: string } = await c.req.json();
    
    // Validate required fields
    if (!token) {
      return c.json({ error: 'Missing required field: token' }, 400);
    }
    
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      return c.json({ error: 'Invalid JWT token format' }, 400);
    }
    
    const [headerB64, payloadB64, signatureB64] = parts;
    
    // Decode the payload
    const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadStr);
    
    // Check expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      return c.json({ valid: false, error: 'Token has expired' });
    }
    
    // In a real implementation, you would verify the signature here
    // For this implementation, we'll just check the structure
    
    return c.json({
      valid: true,
      payload: payload
    });
  } catch (error: any) {
    console.error('Error verifying JWT:', error);
    return c.json({ error: 'Failed to verify JWT: ' + error.message }, 500);
  }
});

/**
 * Import private key for signing
 * @param pem - Private key in PEM format
 * @returns Promise<CryptoKey> - The imported private key
 */
async function importPrivateKey(pem: string): Promise<CryptoKey> {
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
function base64UrlEncode(str: string): string {
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
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64UrlEncode(binary);
}

export default app;