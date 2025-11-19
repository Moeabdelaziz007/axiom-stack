// Test file for Firestore integration
// This file demonstrates how to use the Firestore service

import { FirestoreAuth, FirestoreClient } from './firestore';

// Example usage:
async function testFirestore() {
  // Initialize the authentication service
  // In a real application, you would get this from environment variables
  const serviceAccountJson = `{
    "type": "service_account",
    "project_id": "your-project-id",
    "private_key_id": "your-private-key-id",
    "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
    "client_email": "your-service-account@your-project-id.iam.gserviceaccount.com",
    "client_id": "your-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"
  }`;
  
  const auth = new FirestoreAuth(serviceAccountJson);
  const firestore = new FirestoreClient('your-project-id', auth);
  
  try {
    // Example: Set a document
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        notifications: true
      }
    };
    
    const result = await firestore.setDocument('users', 'user123', userData);
    console.log('Document set successfully:', result);
    
    // Example: Get a document
    const user = await firestore.getDocument('users', 'user123');
    console.log('Retrieved document:', user);
    
    // Example: Run a query
    const filters = [
      { field: 'preferences.theme', operator: 'EQUAL', value: 'dark' }
    ];
    
    const queryResults = await firestore.runQuery('users', filters);
    console.log('Query results:', queryResults);
    
  } catch (error) {
    console.error('Error testing Firestore:', error);
  }
}

// Run the test
testFirestore();