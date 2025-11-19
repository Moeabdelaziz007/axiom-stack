/**
 * ChatRoom Durable Object
 * Maintains conversation history for each chat session
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export class ChatRoom implements DurableObject {
  storage: DurableObjectStorage;

  constructor(state: DurableObjectState) {
    this.storage = state.storage;
  }

  // Add a message to the chat history
  async addMessage(role: 'user' | 'assistant', content: string): Promise<void> {
    const id = crypto.randomUUID();
    const message: Message = {
      id,
      role,
      content,
      timestamp: Date.now()
    };

    // Get current messages
    let messages: Message[] = (await this.storage.get<Message[]>('messages')) || [];
    
    // Add new message
    messages.push(message);
    
    // Keep only the last 20 messages
    if (messages.length > 20) {
      messages = messages.slice(-20);
    }
    
    // Save updated messages
    await this.storage.put('messages', messages);
  }

  // Get the chat history
  async getHistory(): Promise<Message[]> {
    const messages: Message[] = (await this.storage.get<Message[]>('messages')) || [];
    return messages;
  }

  // Clear the chat history
  async clearHistory(): Promise<void> {
    await this.storage.delete('messages');
  }

  // Handle HTTP requests from clients
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'POST' && path === '/add-message') {
      try {
        const { role, content } = await request.json();
        
        if (!role || !content) {
          return new Response(JSON.stringify({ error: 'role and content are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        await this.addMessage(role, content);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else if (request.method === 'POST' && path === '/get-context') {
      try {
        const history = await this.getHistory();
        return new Response(JSON.stringify({ history }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to get context' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else if (request.method === 'POST' && path === '/clear-history') {
      try {
        await this.clearHistory();
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to clear history' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Invalid endpoint or method' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}