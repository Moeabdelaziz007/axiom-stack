#!/usr/bin/env python3
"""
Test script for the GCP Executor service
"""

import base64
import json
import requests

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get('http://localhost:8080/')
        print(f"Health check response: {response.status_code}")
        print(f"Response data: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing health check: {e}")
        return False

def test_analyze_endpoint():
    """Test the analyze endpoint with a sample Pub/Sub message"""
    try:
        # Create a sample analysis task
        task_payload = {
            "agent_id": "test-agent-123",
            "request": {
                "type": "mathematical_analysis",
                "data": [1, 2, 3, 4, 5],
                "operation": "statistical_summary"
            },
            "timestamp": 1234567890,
            "priority": "normal"
        }
        
        # Encode the payload as Base64
        payload_string = json.dumps(task_payload)
        base64_payload = base64.b64encode(payload_string.encode('utf-8')).decode('utf-8')
        
        # Create the Pub/Sub message format
        pubsub_message = {
            "message": {
                "data": base64_payload,
                "messageId": "test-message-123",
                "publishTime": "2023-01-01T00:00:00Z"
            },
            "subscription": "test-subscription"
        }
        
        # Send the request
        response = requests.post(
            'http://localhost:8080/analyze',
            json=pubsub_message,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Analyze endpoint response: {response.status_code}")
        print(f"Response data: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing analyze endpoint: {e}")
        return False

if __name__ == '__main__':
    print("Testing GCP Executor service...")
    
    print("\n1. Testing health check endpoint:")
    health_ok = test_health_check()
    
    print("\n2. Testing analyze endpoint:")
    analyze_ok = test_analyze_endpoint()
    
    print(f"\nTest Results:")
    print(f"Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Analyze Endpoint: {'✅ PASS' if analyze_ok else '❌ FAIL'}")
    
    if health_ok and analyze_ok:
        print("\n🎉 All tests passed!")
    else:
        print("\n⚠️  Some tests failed.")