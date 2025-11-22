// Gemini REST API client for Cloudflare Workers
import { GeminiPayload, GeminiResponse, AIResponse } from './gemini-types';

export class GeminiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
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
   * Helper to inject Chain of Thought rules
   */
  private injectCoT(systemInstruction?: string): string {
    const baseInstruction = systemInstruction || '';
    const cotRules = `

## CRITICAL: Chain of Thought Reasoning Protocol
Before executing any tool, making a trade decision, or providing a final answer, you MUST:
1. Write your reasoning inside <reasoning>...</reasoning> tags.
2. In your reasoning, analyze:
   - User intent: What is the user really asking for?
   - Risk assessment: What could go wrong?
   - Data verification: Do I have enough information?
   - Memory Check: Do I have relevant past memories?
   - Alternative approaches: Are there better options?
3. Only after completing your reasoning should you take action or provide an answer.

## CRITICAL: Strategy Thinking (Multi-Step Planning)
If a user request requires multiple steps, you MUST:
1. **Outline a PLAN first** inside your <reasoning> tags
2. **Execute tools sequentially**, one at a time
3. **Analyze each result** before proceeding to the next step
4. **Adapt your plan** based on intermediate results

### Multi-Step Examples:
- **"Analyze and Buy SOL"**: 
  Step 1: Use scan_token_security to verify safety
  Step 2: Use get_token_data to check liquidity
  Step 3: Use get_jupiter_quote to get price
  Step 4: If all checks pass, use execute_swap_solana

- **"Research Bitcoin trends and save report"**:
  Step 1: Use google_search_grounding to find latest news
  Step 2: Use run_bigquery_sql to query historical data
  Step 3: Use execute_python_script to analyze trends
  Step 4: Use save_report_firestore to save findings

- **"Plan trip to Tokyo"**:
  Step 1: Use get_health_advisory to check safety
  Step 2: Use plan_route_maps to calculate travel time
  Step 3: Use get_weather_forecast to plan timing
  Step 4: Use add_calendar_event to schedule

### Example Reasoning with Strategy:
<reasoning>
User wants to "buy SOL if it's safe". This requires multiple steps:
- Step 1: Security check (scan_token_security)
- Step 2: Price check (get_token_data)
- Step 3: Execution (execute_swap_solana)

Let me start with Step 1: Security scan.
</reasoning>

[Then call the first tool]
`;
    return baseInstruction + cotRules;
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

    const enhancedSystemInstruction = this.injectCoT(systemInstruction);

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

    const enhancedSystemInstruction = this.injectCoT(systemInstruction);

    if (enhancedSystemInstruction) {
      payload.system_instruction = {
        parts: [{ text: enhancedSystemInstruction }]
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

    const enhancedSystemInstruction = this.injectCoT(systemInstruction);

    if (enhancedSystemInstruction) {
      payload.system_instruction = {
        parts: [{ text: enhancedSystemInstruction }]
      };
    }

    return payload;
  }

  /**
   * Create a payload with dynamically filtered tools based on archetype
   * @param prompt - The user prompt
   * @param systemInstruction - System instruction
   * @param allowedTools - List of allowed tool names
   * @returns Gemini payload with specific tools
   */
  createPayloadWithTools(prompt: string, systemInstruction: string, allowedTools: string[] = []): GeminiPayload {
    const tools: any[] = [];

    // 1. Google Search
    if (allowedTools.includes('google_search')) {
      tools.push({ google_search: {} });
    }

    // 2. Python Execution
    if (allowedTools.includes('run_python')) {
      tools.push({
        function_declarations: [
          {
            name: "run_python_analysis",
            description: "Executes Python code for complex math or data analysis.",
            parameters: {
              type: "object",
              properties: {
                code: { type: "string", description: "Python code to execute" },
                args: { type: "array", items: { type: "any" }, description: "Arguments" }
              },
              required: ["code"]
            }
          }
        ]
      });
    }

    // 3. Jupiter Price (DeFi)
    if (allowedTools.includes('jupiter_price')) {
      tools.push({
        function_declarations: [
          {
            name: "get_token_price",
            description: "Get current price of a Solana token via Jupiter.",
            parameters: {
              type: "object",
              properties: {
                tokenSymbol: { type: "string", description: "Symbol of the token (e.g., SOL, USDC)" }
              },
              required: ["tokenSymbol"]
            }
          }
        ]
      });
    }

    // 4. Helius Audit (Risk)
    if (allowedTools.includes('helius_audit')) {
      tools.push({
        function_declarations: [
          {
            name: "audit_token_risk",
            description: "Audit a token for security risks using Helius.",
            parameters: {
              type: "object",
              properties: {
                mintAddress: { type: "string", description: "Mint address of the token" }
              },
              required: ["mintAddress"]
            }
          }
        ]
      });
    }

    // 5. Travel Tools (Voyager)
    if (allowedTools.includes('plan_route')) {
      tools.push({
        function_declarations: [
          {
            name: "plan_travel_route",
            description: "Plan a travel route between locations.",
            parameters: {
              type: "object",
              properties: {
                origin: { type: "string", description: "Starting location" },
                destination: { type: "string", description: "Ending location" },
                mode: { type: "string", description: "Mode of transport" }
              },
              required: ["origin", "destination"]
            }
          }
        ]
      });
    }

    const payload: GeminiPayload = {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      tools: tools.length > 0 ? tools : undefined
    };

    const enhancedSystemInstruction = this.injectCoT(systemInstruction);

    if (enhancedSystemInstruction) {
      payload.system_instruction = {
        parts: [{ text: enhancedSystemInstruction }]
      };
    }

    return payload;
  }
}