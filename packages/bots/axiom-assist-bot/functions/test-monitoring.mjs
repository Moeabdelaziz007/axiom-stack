// test-monitoring.mjs - Test script for the monitoring function
import { monitorAgents } from './monitoring-function.mjs';

// Simulate a request/response for testing
const req = {};
const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log(`Response [${this.statusCode}]:`, JSON.stringify(data, null, 2));
  }
};

console.log('🧪 Testing monitoring function...');

// Run the monitoring function
await monitorAgents(req, res);

console.log('✅ Test completed!');