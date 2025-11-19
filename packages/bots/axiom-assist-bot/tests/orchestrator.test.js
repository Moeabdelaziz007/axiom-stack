import AxiomOrchestrator from '../orchestrator.mjs';
import express from 'express';

// Mock the imported modules
jest.mock('../mind/human-mind.mjs');
jest.mock('../body/system-body.mjs');
jest.mock('../gems/GemManager.mjs');
jest.mock('../pinecone-client.mjs');
jest.mock('../firestore-client.mjs');

// Mock express app
jest.mock('express', () => {
  return () => ({
    use: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
    listen: jest.fn()
  });
});

describe('AxiomOrchestrator', () => {
  let orchestrator;
  
  beforeEach(() => {
    orchestrator = new AxiomOrchestrator();
  });
  
  describe('constructor', () => {
    it('should initialize with default properties', () => {
      expect(orchestrator.running).toBe(false);
      expect(orchestrator.pendingTasks).toBeDefined();
    });
  });
  
  describe('registerTask', () => {
    it('should register a task with a socket', () => {
      const taskId = 'task-123';
      const socket = { id: 'socket-456' };
      
      orchestrator.registerTask(taskId, socket);
      
      expect(orchestrator.pendingTasks.has(taskId)).toBe(true);
      expect(orchestrator.pendingTasks.get(taskId).socket).toBe(socket);
    });
  });
  
  describe('handleUserQuery', () => {
    it('should handle a user query successfully', async () => {
      const mockResponse = 'This is a test response';
      
      // Mock the gemManager and systemBody methods
      orchestrator.gemManager.routeRequest = jest.fn().mockResolvedValue(null);
      orchestrator.systemBody.processQuery = jest.fn().mockResolvedValue(mockResponse);
      
      const result = await orchestrator.handleUserQuery('Hello world');
      
      expect(result).toBe(mockResponse);
      expect(orchestrator.systemBody.processQuery).toHaveBeenCalledWith('Hello world');
    });
    
    it('should return gem response when available', async () => {
      const gemResponse = 'Gem response';
      
      // Mock the gemManager to return a response
      orchestrator.gemManager.routeRequest = jest.fn().mockResolvedValue(gemResponse);
      
      const result = await orchestrator.handleUserQuery('Hello world');
      
      expect(result).toBe(gemResponse);
      expect(orchestrator.gemManager.routeRequest).toHaveBeenCalledWith('Hello world');
    });
  });
  
  describe('setupCallbackEndpoint', () => {
    it('should set up the ADK callback endpoint', () => {
      // Check if the POST endpoint was registered
      expect(orchestrator.app.post).toHaveBeenCalledWith('/adk-callback', expect.any(Function));
    });
    
    it('should set up the health check endpoint', () => {
      // Check if the GET endpoint was registered
      expect(orchestrator.app.get).toHaveBeenCalledWith('/health', expect.any(Function));
    });
  });
});