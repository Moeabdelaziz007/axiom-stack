// pinecone-client.mjs - Pinecone integration for Axiom ID
import { Pinecone } from '@pinecone-database/pinecone';

class PineconeClient {
  constructor() {
    this.client = null;
    this.indexName = 'axiom-id-brain';
    this.isInitialized = false;
  }

  async initialize() {
    try {
      if (!process.env.PINECONE_API_KEY) {
        throw new Error('PINECONE_API_KEY environment variable is required');
      }

      this.client = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });

      // Check if index exists, create if it doesn't
      await this.ensureIndexExists();

      this.isInitialized = true;
      console.log('✅ Pinecone client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Pinecone client:', error);
      this.isInitialized = false;
    }
  }

  async ensureIndexExists() {
    try {
      const indexes = await this.client.listIndexes();
      const indexExists = indexes.indexes?.some(index => index.name === this.indexName);

      if (!indexExists) {
        console.log(`Creating Pinecone index: ${this.indexName}`);
        await this.client.createIndex({
          name: this.indexName,
          dimension: 768, // Gemini embedding dimension
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-west-2'
            }
          }
        });
        console.log(`✅ Created Pinecone index: ${this.indexName}`);

        // Wait for index to be ready
        await this.waitForIndexReady();
      } else {
        console.log(`✅ Pinecone index already exists: ${this.indexName}`);
      }
    } catch (error) {
      console.error('Error ensuring Pinecone index exists:', error);
      throw error;
    }
  }

  async waitForIndexReady() {
    console.log('Waiting for Pinecone index to be ready...');
    let isReady = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!isReady && attempts < maxAttempts) {
      try {
        const description = await this.client.describeIndex(this.indexName);
        if (description.status?.ready) {
          isReady = true;
          console.log('✅ Pinecone index is ready');
        } else {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        attempts++;
        console.log(`Attempt ${attempts}: Index not ready yet...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!isReady) {
      throw new Error('Pinecone index failed to become ready within timeout');
    }
  }

  getIndex() {
    if (!this.isInitialized || !this.client) {
      throw new Error('Pinecone client not initialized. Call initialize() first.');
    }
    return this.client.Index(this.indexName);
  }

  async upsertVectors(vectors, namespace = '') {
    if (!this.isInitialized) {
      throw new Error('Pinecone client not initialized');
    }

    try {
      const index = this.getIndex();
      const upsertRequest = {
        vectors: vectors,
        namespace: namespace
      };

      await index.upsert(upsertRequest);
      console.log(`✅ Upserted ${vectors.length} vectors to Pinecone`);
    } catch (error) {
      console.error('Error upserting vectors to Pinecone:', error);
      throw error;
    }
  }

  async queryVectors(queryVector, topK = 5, namespace = '') {
    if (!this.isInitialized) {
      throw new Error('Pinecone client not initialized');
    }

    try {
      const index = this.getIndex();
      const queryRequest = {
        vector: queryVector,
        topK: topK,
        includeMetadata: true,
        namespace: namespace
      };

      const response = await index.query(queryRequest);
      return response.matches || [];
    } catch (error) {
      console.error('Error querying vectors from Pinecone:', error);
      throw error;
    }
  }

  async deleteAllVectors(namespace = '') {
    if (!this.isInitialized) {
      throw new Error('Pinecone client not initialized');
    }

    try {
      const index = this.getIndex();
      await index.deleteAll({ namespace });
      console.log(`✅ Deleted all vectors from namespace: ${namespace}`);
    } catch (error) {
      console.error('Error deleting vectors from Pinecone:', error);
      throw error;
    }
  }
}

export default PineconeClient;