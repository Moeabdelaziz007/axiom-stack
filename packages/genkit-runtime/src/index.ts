import express from 'express';
import dotenv from 'dotenv';
import { priceFetchFlow } from './flows/price-fetch';
import { slippageCalcFlow } from './flows/slippage-calc';
import { flashLoanSimFlow } from './flows/flashloan-sim';

dotenv.config();

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'genkit-runtime' });
});

// Price fetch endpoint
app.post('/flows/price-fetch', async (req, res) => {
    try {
        const result = await priceFetchFlow(req.body);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Slippage calculator endpoint
app.post('/flows/slippage-calc', async (req, res) => {
    try {
        const result = await slippageCalcFlow(req.body);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Flash loan simulation endpoint
app.post('/flows/flashloan-sim', async (req, res) => {
    try {
        const result = await flashLoanSimFlow(req.body);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// OpenAPI spec generation (for ADK integration)
app.get('/openapi.json', (req, res) => {
    res.json({
        openapi: '3.0.0',
        info: {
            title: 'Genkit Runtime API',
            version: '1.0.0',
            description: 'DeFi tool execution flows for Axiom AI-Fi'
        },
        paths: {
            '/flows/price-fetch': {
                post: {
                    summary: 'Fetch token price',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        symbol: { type: 'string' },
                                        source: { type: 'string', enum: ['birdeye', 'dexscreener', 'jupiter'] }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/flows/slippage-calc': {
                post: {
                    summary: 'Calculate slippage and price impact',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        inputToken: { type: 'string' },
                                        outputToken: { type: 'string' },
                                        amountIn: { type: 'number' },
                                        poolLiquidity: { type: 'number' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/flows/flashloan-sim': {
                post: {
                    summary: 'Simulate flash loan arbitrage',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        protocol: { type: 'string', enum: ['solend', 'marginfi', 'kamino'] },
                                        borrowToken: { type: 'string' },
                                        borrowAmount: { type: 'number' },
                                        arbitrageSteps: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    action: { type: 'string' },
                                                    protocol: { type: 'string' },
                                                    inputToken: { type: 'string' },
                                                    outputToken: { type: 'string' },
                                                    amount: { type: 'number' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`[Genkit Runtime] Running on port ${PORT}`);
    console.log(`[Genkit Runtime] OpenAPI spec available at /openapi.json`);
});
