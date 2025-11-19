// test-utils.js - Common testing utilities for Axiom ID tests

export class TestHelpers {
  /**
   * Create a mock socket object for testing
   */
  static createMockSocket(id = 'test-socket-123') {
    return {
      id,
      emit: jest.fn(),
      on: jest.fn(),
      disconnect: jest.fn()
    };
  }
  
  /**
   * Create a mock HTTP request object
   */
  static createMockRequest(body = {}, params = {}, query = {}) {
    return {
      body,
      params,
      query,
      headers: {}
    };
  }
  
  /**
   * Create a mock HTTP response object
   */
  static createMockResponse() {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis()
    };
    return res;
  }
  
  /**
   * Create a mock Cloud Tasks client
   */
  static createMockCloudTasksClient() {
    return {
      queuePath: jest.fn().mockReturnValue('projects/test-project/locations/us-central1/queues/test-queue'),
      createTask: jest.fn().mockResolvedValue([{ name: 'projects/test-project/locations/us-central1/queues/test-queue/tasks/task-123' }])
    };
  }
  
  /**
   * Create a mock Firestore client
   */
  static createMockFirestoreClient() {
    return {
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      set: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: jest.fn().mockReturnValue({}),
        id: 'test-doc-123'
      }),
      where: jest.fn().mockReturnThis(),
      stream: jest.fn().mockReturnValue([])
    };
  }
  
  /**
   * Create a mock Pinecone client
   */
  static createMockPineconeClient() {
    return {
      Index: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockResolvedValue(),
      query: jest.fn().mockResolvedValue({ matches: [] })
    };
  }
  
  /**
   * Wait for a specified amount of time
   */
  static async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Generate a random string for testing
   */
  static randomString(length = 10) {
    return Math.random().toString(36).substring(2, length + 2);
  }
  
  /**
   * Generate a test payload for Cloud Tasks
   */
  static generateTestPayload(overrides = {}) {
    return {
      text: 'Test message for Cloud Tasks integration',
      clientId: `test-client-${this.randomString()}`,
      timestamp: new Date().toISOString(),
      ...overrides
    };
  }
}

export default TestHelpers;