// pages/test.tsx - Simple test page to verify Next.js is working
import { useState, useEffect } from 'react';

export default function TestPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test API route
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Page</h1>
      <p>This page tests if Next.js API routes are working correctly.</p>
      
      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div>
          <h2>API Response:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Failed to load data</p>
      )}
    </div>
  );
}