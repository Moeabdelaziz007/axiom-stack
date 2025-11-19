import { CloudTasksClient } from '@google-cloud/tasks';
import dotenv from 'dotenv';

dotenv.config();

// Mock the Cloud Tasks client
jest.mock('@google-cloud/tasks');

describe('Cloud Tasks Integration', () => {
  let mockClient;
  
  beforeEach(() => {
    // Create a mock client instance
    mockClient = {
      queuePath: jest.fn().mockReturnValue('projects/test-project/locations/us-central1/queues/test-queue'),
      createTask: jest.fn().mockResolvedValue([{ name: 'projects/test-project/locations/us-central1/queues/test-queue/tasks/task-123' }])
    };
    
    // Mock the CloudTasksClient constructor to return our mock client
    CloudTasksClient.mockImplementation(() => mockClient);
  });
  
  describe('createAgentTask', () => {
    it('should create a task with correct parameters', async () => {
      // Import the function we want to test
      const { default: createAgentTask } = await import('../test-cloud-tasks.mjs');
      
      const payload = {
        text: 'Test message',
        clientId: 'test-client-123',
        timestamp: new Date().toISOString()
      };
      
      const serviceAccountEmail = 'test@example.com';
      const agentServiceUrl = 'http://localhost:8080';
      const projectId = 'test-project';
      const location = 'us-central1';
      const queue = 'test-queue';
      
      // Call the function
      const taskName = await createAgentTask(
        payload,
        serviceAccountEmail,
        agentServiceUrl,
        projectId,
        location,
        queue
      );
      
      // Verify the client methods were called correctly
      expect(mockClient.queuePath).toHaveBeenCalledWith(projectId, location, queue);
      expect(mockClient.createTask).toHaveBeenCalledWith({
        parent: 'projects/test-project/locations/us-central1/queues/test-queue',
        task: {
          httpRequest: {
            httpMethod: 'POST',
            url: agentServiceUrl,
            headers: { 'Content-Type': 'application/json' },
            body: expect.any(String), // Base64 encoded payload
            oidcToken: {
              serviceAccountEmail: serviceAccountEmail,
            },
          },
        }
      });
      
      // Verify the task name is returned correctly
      expect(taskName).toBe('projects/test-project/locations/us-central1/queues/test-queue/tasks/task-123');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock the createTask method to throw an error
      mockClient.createTask.mockRejectedValue(new Error('Task creation failed'));
      
      // Import the function we want to test
      const { default: createAgentTask } = await import('../test-cloud-tasks.mjs');
      
      const payload = {
        text: 'Test message',
        clientId: 'test-client-123',
        timestamp: new Date().toISOString()
      };
      
      const serviceAccountEmail = 'test@example.com';
      const agentServiceUrl = 'http://localhost:8080';
      const projectId = 'test-project';
      const location = 'us-central1';
      const queue = 'test-queue';
      
      // Verify that the function throws an error
      await expect(createAgentTask(
        payload,
        serviceAccountEmail,
        agentServiceUrl,
        projectId,
        location,
        queue
      )).rejects.toThrow('Task creation failed');
    });
  });
});import { CloudTasksClient } from '@google-cloud/tasks';
import dotenv from 'dotenv';

dotenv.config();

// Mock the Cloud Tasks client
jest.mock('@google-cloud/tasks');

describe('Cloud Tasks Integration', () => {
  let mockClient;
  
  beforeEach(() => {
    // Create a mock client instance
    mockClient = {
      queuePath: jest.fn().mockReturnValue('projects/test-project/locations/us-central1/queues/test-queue'),
      createTask: jest.fn().mockResolvedValue([{ name: 'projects/test-project/locations/us-central1/queues/test-queue/tasks/task-123' }])
    };
    
    // Mock the CloudTasksClient constructor to return our mock client
    CloudTasksClient.mockImplementation(() => mockClient);
  });
  
  describe('createAgentTask', () => {
    it('should create a task with correct parameters', async () => {
      // Import the function we want to test
      const { default: createAgentTask } = await import('../test-cloud-tasks.mjs');
      
      const payload = {
        text: 'Test message',
        clientId: 'test-client-123',
        timestamp: new Date().toISOString()
      };
      
      const serviceAccountEmail = 'test@example.com';
      const agentServiceUrl = 'http://localhost:8080';
      const projectId = 'test-project';
      const location = 'us-central1';
      const queue = 'test-queue';
      
      // Call the function
      const taskName = await createAgentTask(
        payload,
        serviceAccountEmail,
        agentServiceUrl,
        projectId,
        location,
        queue
      );
      
      // Verify the client methods were called correctly
      expect(mockClient.queuePath).toHaveBeenCalledWith(projectId, location, queue);
      expect(mockClient.createTask).toHaveBeenCalledWith({
        parent: 'projects/test-project/locations/us-central1/queues/test-queue',
        task: {
          httpRequest: {
            httpMethod: 'POST',
            url: agentServiceUrl,
            headers: { 'Content-Type': 'application/json' },
            body: expect.any(String), // Base64 encoded payload
            oidcToken: {
              serviceAccountEmail: serviceAccountEmail,
            },
          },
        }
      });
      
      // Verify the task name is returned correctly
      expect(taskName).toBe('projects/test-project/locations/us-central1/queues/test-queue/tasks/task-123');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock the createTask method to throw an error
      mockClient.createTask.mockRejectedValue(new Error('Task creation failed'));
      
      // Import the function we want to test
      const { default: createAgentTask } = await import('../test-cloud-tasks.mjs');
      
      const payload = {
        text: 'Test message',
        clientId: 'test-client-123',
        timestamp: new Date().toISOString()
      };
      
      const serviceAccountEmail = 'test@example.com';
      const agentServiceUrl = 'http://localhost:8080';
      const projectId = 'test-project';
      const location = 'us-central1';
      const queue = 'test-queue';
      
      // Verify that the function throws an error
      await expect(createAgentTask(
        payload,
        serviceAccountEmail,
        agentServiceUrl,
        projectId,
        location,
        queue
      )).rejects.toThrow('Task creation failed');
    });
  });
});