// packages/workers/tool-executor/src/ToolRegistry.ts

import { AixToolboxEntry } from '../../core/src/schema/AixSchema';

export const ToolRegistry: AixToolboxEntry[] = [
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
            }
            // Add more Binance functions as needed
        ]
    },
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
    }
    // Add additional tools (e.g., DALL·E, Twitter, etc.) following this structure
];
