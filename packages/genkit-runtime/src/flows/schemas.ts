import { z } from 'zod';

// Price fetch flow schema
export const PriceFetchInputSchema = z.object({
    symbol: z.string().describe('Token symbol (e.g., SOL, USDC)'),
    source: z.enum(['birdeye', 'dexscreener', 'jupiter']).optional().default('birdeye')
});

export const PriceFetchOutputSchema = z.object({
    symbol: z.string(),
    price: z.number(),
    priceChange24h: z.number().optional(),
    volume24h: z.number().optional(),
    timestamp: z.number()
});

// Slippage calculator flow schema
export const SlippageCalcInputSchema = z.object({
    inputToken: z.string(),
    outputToken: z.string(),
    amountIn: z.number(),
    poolLiquidity: z.number()
});

export const SlippageCalcOutputSchema = z.object({
    expectedSlippage: z.number().describe('Expected slippage percentage'),
    priceImpact: z.number().describe('Price impact percentage'),
    minOutputAmount: z.number(),
    recommendation: z.enum(['safe', 'moderate', 'high_risk'])
});

// Flash loan simulation flow schema
export const FlashLoanSimInputSchema = z.object({
    protocol: z.enum(['solend', 'marginfi', 'kamino']),
    borrowToken: z.string(),
    borrowAmount: z.number(),
    arbitrageSteps: z.array(z.object({
        action: z.enum(['swap', 'lend', 'borrow']),
        protocol: z.string(),
        inputToken: z.string(),
        outputToken: z.string(),
        amount: z.number()
    }))
});

export const FlashLoanSimOutputSchema = z.object({
    success: z.boolean(),
    estimatedProfit: z.number(),
    gasEstimate: z.number(),
    netProfit: z.number().describe('Profit after gas fees'),
    risks: z.array(z.string()),
    shouldExecute: z.boolean()
});

export type PriceFetchInput = z.infer<typeof PriceFetchInputSchema>;
export type PriceFetchOutput = z.infer<typeof PriceFetchOutputSchema>;
export type SlippageCalcInput = z.infer<typeof SlippageCalcInputSchema>;
export type SlippageCalcOutput = z.infer<typeof SlippageCalcOutputSchema>;
export type FlashLoanSimInput = z.infer<typeof FlashLoanSimInputSchema>;
export type FlashLoanSimOutput = z.infer<typeof FlashLoanSimOutputSchema>;
