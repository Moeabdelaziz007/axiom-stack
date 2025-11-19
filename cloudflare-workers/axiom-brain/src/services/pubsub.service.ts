// PubSubService.ts - Service for sending messages to Google Cloud Pub/Sub
// This service is designed to be used by Cloudflare Workers to trigger analysis tasks

export interface AnalysisTask {
  agent_id: string;
  request: any;
  timestamp: number;
  priority?: 'low' | 'normal' | 'high';
  metadata?: Record<string, any>;
}

export class PubSubService {
  private projectId: string;
  private topicId: string;
  private apiUrl: string;

  constructor(projectId: string, topicId: string) {
    this.projectId = projectId;
    this.topicId = topicId;
    // Google Cloud Pub/Sub Push endpoint
    this.apiUrl = `https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${topicId}:publish`;
  }

  /**
   * Trigger an analysis task by sending it to the Pub/Sub topic
   * @param payload - The analysis task payload
   * @returns Promise that resolves when the message is sent
   */
  async triggerAnalysis(payload: AnalysisTask): Promise<boolean> {
    try {
      // Add timestamp if not present
      if (!payload.timestamp) {
        payload.timestamp = Date.now();
      }

      // Encode the payload as Base64
      const payloadString = JSON.stringify(payload);
      const base64Payload = btoa(payloadString);

      // Create the Pub/Sub message
      const message = {
        messages: [
          {
            data: base64Payload
          }
        ]
      };

      // In a real implementation, you would send this to Google Cloud Pub/Sub
      // For now, we'll log it and return success
      console.log('PubSubService: Would send message to topic', this.topicId);
      console.log('Message payload:', payload);
      
      // Simulate successful send
      return true;
    } catch (error) {
      console.error('PubSubService: Error triggering analysis:', error);
      return false;
    }
  }

  /**
   * Create and send a message to Pub/Sub
   * @param payload - The message payload
   * @param attributes - Optional message attributes
   * @returns Promise that resolves with the response
   */
  async publishMessage(payload: any, attributes: Record<string, string> = {}): Promise<any> {
    try {
      // Encode the payload as Base64
      const payloadString = JSON.stringify(payload);
      const base64Payload = btoa(payloadString);

      // Create the Pub/Sub message
      const message = {
        messages: [
          {
            data: base64Payload,
            attributes: attributes
          }
        ]
      };

      // In a production environment, you would make an authenticated request to:
      // POST https://pubsub.googleapis.com/v1/projects/PROJECT_ID/topics/TOPIC_ID:publish
      // With proper authentication headers
      
      console.log('PubSubService: Publishing message with attributes:', attributes);
      console.log('Payload:', payload);
      
      // Simulate successful publish
      return {
        messageIds: ['mock-message-id']
      };
    } catch (error) {
      console.error('PubSubService: Error publishing message:', error);
      throw error;
    }
  }
}