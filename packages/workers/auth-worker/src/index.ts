// packages/workers/auth-worker/src/index.ts - Authentication Worker for Nano Banana Architecture
import { Hono } from 'hono';

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
    
    // TODO: Implement JWT signing using Web Crypto API
    // This is a simplified version - in production, you would sign with the private key
    const jwt = `${signatureInput}.UNSIGNED`;
    
    return c.json({
      token: jwt,
      expiresIn: 3600
    });
  } catch (error: any) {
    console.error('Error generating JWT:', error);
    return c.json({ error: 'Failed to generate JWT' }, 500);
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
    
    // TODO: Implement JWT verification
    // This is a simplified version - in production, you would verify the signature
    
    return c.json({
      valid: true,
      message: 'Token verification not implemented in this simplified version'
    });
  } catch (error: any) {
    console.error('Error verifying JWT:', error);
    return c.json({ error: 'Failed to verify JWT' }, 500);
  }
});

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

export default app;