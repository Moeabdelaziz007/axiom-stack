// firestore-client.mjs - Firestore integration for Axiom ID
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

class FirestoreClient {
  constructor() {
    this.client = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Initialize Firebase Admin SDK
      initializeApp();
      this.client = getFirestore();
      
      this.isInitialized = true;
      console.log('✅ Firestore client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firestore client:', error);
      this.isInitialized = false;
    }
  }

  getCollection(collectionName) {
    if (!this.isInitialized || !this.client) {
      throw new Error('Firestore client not initialized. Call initialize() first.');
    }
    return this.client.collection(collectionName);
  }

  async upsertDocument(collectionName, documentId, data) {
    if (!this.isInitialized) {
      throw new Error('Firestore client not initialized');
    }

    try {
      const collection = this.getCollection(collectionName);
      await collection.doc(documentId).set(data, { merge: true });
      console.log(`✅ Upserted document ${documentId} to Firestore collection ${collectionName}`);
    } catch (error) {
      console.error('Error upserting document to Firestore:', error);
      throw error;
    }
  }

  async getDocument(collectionName, documentId) {
    if (!this.isInitialized) {
      throw new Error('Firestore client not initialized');
    }

    try {
      const collection = this.getCollection(collectionName);
      const doc = await collection.doc(documentId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error getting document from Firestore:', error);
      throw error;
    }
  }

  async queryCollection(collectionName, conditions = []) {
    if (!this.isInitialized) {
      throw new Error('Firestore client not initialized');
    }

    try {
      let query = this.getCollection(collectionName);
      
      // Apply query conditions
      conditions.forEach(condition => {
        query = query.where(condition.field, condition.operator, condition.value);
      });
      
      const snapshot = await query.get();
      const results = [];
      snapshot.forEach(doc => {
        results.push({
          id: doc.id,
          data: doc.data()
        });
      });
      
      return results;
    } catch (error) {
      console.error('Error querying collection from Firestore:', error);
      throw error;
    }
  }
}

export default FirestoreClient;