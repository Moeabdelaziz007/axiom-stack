// pages/test-api.tsx - Simple test page to verify Next.js API routes
import { useState, useEffect } from 'react';

export default function TestApiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const testApiRoute = async (route: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(route);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Next.js API Routes Test</h1>
      <p>This page tests if Next.js API routes are working correctly.</p>
      
      <div style={{ margin: '1rem 0' }}>
        <button 
          onClick={() => testApiRoute('/api/agents')}
          style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test /api/agents
        </button>
        <button 
          onClick={() => testApiRoute('/api/simple-test')}
          style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test /api/simple-test
        </button>
        <button 
          onClick={() => testApiRoute('/api/health')}
          style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test /api/health
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div>
          <h2>API Response:</h2>
          <pre style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '4px', overflowX: 'auto' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}