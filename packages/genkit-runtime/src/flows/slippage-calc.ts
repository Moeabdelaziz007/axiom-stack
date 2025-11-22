import { SlippageCalcInput, SlippageCalcOutput, SlippageCalcInputSchema, SlippageCalcOutputSchema } from './schemas';

/**
 * Slippage Calculator Flow - Calculate expected slippage and price impact
 * Critical for DeFi trading decisions to avoid sandwich attacks
 */
export async function slippageCalcFlow(input: SlippageCalcInput): Promise<SlippageCalcOutput> {
    const validatedInput = SlippageCalcInputSchema.parse(input);

    console.log(`[Genkit Flow] Calculating slippage for ${validatedInput.inputToken} -> ${validatedInput.outputToken}`);

    // Calculate price impact based on pool liquidity
    const priceImpact = (validatedInput.amountIn / validatedInput.poolLiquidity) * 100;

    // Estimate slippage (simplified model)
    const expectedSlippage = priceImpact * 1.2; // Add 20% buffer

    // Calculate minimum output amount with slippage tolerance
    const minOutputAmount = validatedInput.amountIn * (1 - expectedSlippage / 100);

    // Risk assessment
    let recommendation: 'safe' | 'moderate' | 'high_risk';
    if (priceImpact < 1) {
        recommendation = 'safe';
    } else if (priceImpact < 3) {
        recommendation = 'moderate';
    } else {
        recommendation = 'high_risk';
    }

    return {
        expectedSlippage,
        priceImpact,
        minOutputAmount,
        recommendation
    };
}
