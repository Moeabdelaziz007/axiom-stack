// test-web-api.mjs - Simple test to verify web API service starts correctly
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Web API service is working!' });
});

// Simple agents endpoint
app.get('/api/agents', (req, res) => {
  res.json([
    {
      id: "test_agent_001",
      name: "Test Agent",
      description: "A simple test agent",
      status: "active"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Test Web API server listening on port ${PORT}`);
});