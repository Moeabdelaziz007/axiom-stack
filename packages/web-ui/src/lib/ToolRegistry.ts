// packages/web-ui/src/lib/ToolRegistry.ts

import { AixToolboxEntry } from './schema/AixSchema';

export const ToolRegistry: AixToolboxEntry[] = [
    // ===== FINANCE TOOLS =====
    {
        toolName: 'Binance API',
        category: 'Finance',
        functions: [
            {
                name: 'binance_execute_limit_order',
                description: 'Executes a limit buy or sell order on Binance exchange.',
                parameters: {
                    type: 'object',
                    properties: {
                        symbol: { type: 'string', description: 'Trading pair, e.g., ETHUSDT' },
                        side: { type: 'string', description: 'BUY or SELL' },
                        price: { type: 'number', description: 'Limit price for the order' },
                        quantity: { type: 'number', description: 'Amount of base currency to trade' }
                    },
                    required: ['symbol', 'side', 'price', 'quantity']
                }
            },
            {
                name: 'binance_get_current_price',
                description: 'Retrieves the current market price for a given trading pair.',
                parameters: {
                    type: 'object',
                    properties: {
                        symbol: { type: 'string', description: 'Trading pair, e.g., SOLUSDT' }
                    },
                    required: ['symbol']
                }
            }
        ]
    },
    {
        toolName: 'CoinGecko API',
        category: 'Finance',
        functions: [
            {
                name: 'coingecko_get_price',
                description: 'Get current price of cryptocurrencies (Free: 30 calls/min, 10k/month)',
                parameters: {
                    type: 'object',
                    properties: {
                        ids: { type: 'string', description: 'Comma-separated crypto IDs, e.g., bitcoin,ethereum' },
                        vs_currencies: { type: 'string', description: 'Fiat currency, e.g., usd' }
                    },
                    required: ['ids', 'vs_currencies']
                }
            }
        ]
    },

    // ===== DATA & SEARCH TOOLS =====
    {
        toolName: 'Google Search Tool',
        category: 'Data',
        functions: [
            {
                name: 'google_search',
                description: 'Performs a real-time web search to find current information.',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'The search query string.' }
                    },
                    required: ['query']
                }
            }
        ]
    },
    {
        toolName: 'NewsData.io API',
        category: 'Data',
        functions: [
            {
                name: 'newsdata_get_latest',
                description: 'Fetch latest news articles (Free: 200 credits/day)',
                parameters: {
                    type: 'object',
                    properties: {
                        q: { type: 'string', description: 'Search query or topic' },
                        language: { type: 'string', description: 'Language code, e.g., en' }
                    },
                    required: ['q']
                }
            }
        ]
    },
    {
        toolName: 'OpenWeatherMap API',
        category: 'Data',
        functions: [
            {
                name: 'openweather_current',
                description: 'Get current weather data (Free: 1000 calls/day, 60/min)',
                parameters: {
                    type: 'object',
                    properties: {
                        city: { type: 'string', description: 'City name, e.g., London' },
                        units: { type: 'string', description: 'metric or imperial' }
                    },
                    required: ['city']
                }
            }
        ]
    },

    // ===== CONTENT GENERATION TOOLS =====
    {
        toolName: 'Imagen 3 (Google)',
        category: 'Content',
        functions: [
            {
                name: 'imagen_generate',
                description: 'Generate high-quality images using Google Imagen 3 (Free tier available)',
                parameters: {
                    type: 'object',
                    properties: {
                        prompt: { type: 'string', description: 'Detailed image description' },
                        aspect_ratio: { type: 'string', description: '1:1, 16:9, 9:16, etc.' }
                    },
                    required: ['prompt']
                }
            }
        ]
    },
    {
        toolName: 'Hugging Face Inference',
        category: 'Content',
        functions: [
            {
                name: 'hf_text_generation',
                description: 'Generate text using Llama, Mistral, or other open models (Free serverless)',
                parameters: {
                    type: 'object',
                    properties: {
                        model: { type: 'string', description: 'Model name, e.g., meta-llama/Llama-3.1-8B' },
                        inputs: { type: 'string', description: 'Input prompt' }
                    },
                    required: ['model', 'inputs']
                }
            },
            {
                name: 'hf_image_generation',
                description: 'Generate images with Stable Diffusion models (Free <10GB models)',
                parameters: {
                    type: 'object',
                    properties: {
                        model: { type: 'string', description: 'Model name, e.g., stabilityai/stable-diffusion-xl-base-1.0' },
                        inputs: { type: 'string', description: 'Image prompt' }
                    },
                    required: ['model', 'inputs']
                }
            }
        ]
    },

    // ===== AI / LLM TOOLS =====
    {
        toolName: 'GitHub Models',
        category: 'Other',
        functions: [
            {
                name: 'github_llm_inference',
                description: 'Access GPT-4o, Llama 3.1, DeepSeek via GitHub (Free for all GitHub users)',
                parameters: {
                    type: 'object',
                    properties: {
                        model: { type: 'string', description: 'gpt-4o, llama-3.1-70b, deepseek-r1, etc.' },
                        messages: { type: 'string', description: 'Chat messages array as JSON string' }
                    },
                    required: ['model', 'messages']
                }
            }
        ]
    },
    {
        toolName: 'Groq (Free Tier)',
        category: 'Other',
        functions: [
            {
                name: 'groq_fast_inference',
                description: 'Ultra-low latency LLM inference with Llama, Mixtral (Generous free tier)',
                parameters: {
                    type: 'object',
                    properties: {
                        model: { type: 'string', description: 'Model name, e.g., llama-3.1-70b-versatile' },
                        messages: { type: 'string', description: 'Chat messages' }
                    },
                    required: ['model', 'messages']
                }
            }
        ]
    }
];
