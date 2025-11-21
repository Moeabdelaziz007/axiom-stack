// Gemini REST API client for Cloudflare Workers
import { GeminiPayload, GeminiResponse, AIResponse } from './gemini-types';

export class GeminiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  /**
   * Generate content using Gemini API
   * @param payload - The Gemini API payload
   * @returns Structured AI response
   */
  async generateContent(payload: GeminiPayload): Promise<AIResponse> {
    try {
      // Add default safety settings if not provided
      if (!payload.safety_settings) {
        payload.safety_settings = [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
        ];
      }

      const url = `${this.baseUrl}?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const geminiResponse: GeminiResponse = await response.json();
      return this.parseResponse(geminiResponse);
    } catch (error) {
      console.error('Error in Gemini generateContent:', error);
      throw error;
    }
  }

  /**
   * Parse Gemini API response into structured format
   * @param response - Raw Gemini API response
   * @returns Structured AI response
   */
  private parseResponse(response: GeminiResponse): AIResponse {
    const result: AIResponse = {
      text: '',
      citations: [],
      searchQueries: []
    };

    // Extract text content
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        result.text = candidate.content.parts[0].text || '';
      }

      // Extract citations
      if (candidate.citationMetadata && candidate.citationMetadata.citations) {
        result.citations = candidate.citationMetadata.citations.map(citation => ({
          uri: citation.uri,
          title: citation.title
        }));
      }
    }

    // Extract search queries from grounding metadata
    if (response.groundingMetadata && response.groundingMetadata.webSearchQueries) {
      result.searchQueries = response.groundingMetadata.webSearchQueries;
    }

    return result;
  }

  /**
   * Create a payload with grounding (Google Search)
   * @param prompt - The user prompt
   * @param systemInstruction - System instruction for persona
   * @returns Gemini payload with grounding
   */
  createGroundedPayload(prompt: string, systemInstruction?: string): GeminiPayload {
    const payload: GeminiPayload = {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      tools: [{ google_search: {} }]
    };

    // Inject Chain of Thought (CoT) reasoning requirement
    let enhancedSystemInstruction = systemInstruction || '';

    // Add CoT rules to enforce reasoning traces
    const cotRules = `

## CRITICAL: Chain of Thought Reasoning Protocol
Before executing any tool, making a trade decision, or providing a final answer, you MUST:
1. Write your reasoning inside <reasoning>...</reasoning> tags.
2. In your reasoning, analyze:
   - User intent: What is the user really asking for?
   - Risk assessment: What could go wrong?
   - Data verification: Do I have enough information?
   - Alternative approaches: Are there better options?
3. Only after completing your reasoning should you take action or provide an answer.

Example:
<reasoning>
The user wants to buy SOL. Let me verify:
- Current price is reasonable (checked via Birdeye)
- Liquidity is sufficient (>$100K)
- Risk: Market volatility is high, but within user's tolerance
- Decision: Execute buy with 5% slippage protection
</reasoning>

[Then execute the action or provide response]
`;

    enhancedSystemInstruction += cotRules;

    if (enhancedSystemInstruction) {
      payload.system_instruction = {
        parts: [{ text: enhancedSystemInstruction }]
      };
    }

    return payload;
  }

  /**
   * Create a payload for JSON response
   * @param prompt - The user prompt
   * @param systemInstruction - System instruction for persona
   * @returns Gemini payload with JSON response format
   */
  createJsonPayload(prompt: string, systemInstruction?: string): GeminiPayload {
    const payload: GeminiPayload = {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generation_config: {
        response_mime_type: 'application/json'
      }
    };

    if (systemInstruction) {
      payload.system_instruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    return payload;
  }

  /**
   * Create a payload for vision analysis
   * @param imageData - Base64 encoded image data
   * @param prompt - The analysis prompt
   * @param systemInstruction - System instruction for persona
   * @returns Gemini payload with image data
   */
  createVisionPayload(imageData: string, prompt: string, systemInstruction?: string): GeminiPayload {
    const payload: GeminiPayload = {
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: 'image/png',
              data: imageData
            }
          }
        ]
      }],
      generation_config: {
        response_mime_type: 'application/json'
      }
    };

    if (systemInstruction) {
      payload.system_instruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    return payload;
  }

  /**
   * Create a payload for Python code execution
   * @param prompt - The user prompt
   * @param systemInstruction - System instruction for persona
   * @returns Gemini payload with Python execution tool
   */
  createPythonExecutionPayload(prompt: string, systemInstruction?: string): GeminiPayload {
    const payload: GeminiPayload = {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      tools: [{
        function_declarations: [
          {
            name: "run_python_analysis",
            description: "Executes Python code for complex math or data analysis.",
            parameters: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  description: "Python code to execute"
                },
                args: {
                  type: "array",
                  items: {
                    type: "any"
                  },
                  description: "Arguments to pass to the Python code"
                }
              },
              required: ["code"]
            }
          }
        ]
      }]
    };

    if (systemInstruction) {
      payload.system_instruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    return payload;
  }
}