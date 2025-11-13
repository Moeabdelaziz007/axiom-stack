// Payment Router for Axiom ID
// Routes payments through $AXIOM token or stablecoins with reputation-based trust verification

import { PublicKey } from '@solana/web3.js';
import { AxiomIDSDK } from '../../sdk/src/index';
import { X402Protocol } from '../../protocols/x402';

export class PaymentRouter {
    private sdk: AxiomIDSDK;
    private x402: X402Protocol;
    private axiomTokenMint: string;
    private supportedTokens: Map<string, TokenInfo>;

    constructor(sdk: AxiomIDSDK, axiomTokenMint: string) {
        this.sdk = sdk;
        this.axiomTokenMint = axiomTokenMint;
        this.x402 = new X402Protocol(sdk, axiomTokenMint);
        this.supportedTokens = new Map();
        
        // Initialize supported tokens
        this.initializeSupportedTokens();
    }

    /**
     * Initialize supported tokens
     */
    private initializeSupportedTokens() {
        // $AXIOM token
        this.supportedTokens.set(this.axiomTokenMint, {
            name: 'AXIOM',
            symbol: 'AXIOM',
            decimals: 9,
            isStable: false,
            reputationMultiplier: 1.0
        });
        
        // USDC (example stablecoin)
        this.supportedTokens.set('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', {
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 6,
            isStable: true,
            reputationMultiplier: 0.8 // Stablecoins have lower reputation multiplier
        });
        
        // USDT (example stablecoin)
        this.supportedTokens.set('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', {
            name: 'Tether',
            symbol: 'USDT',
            decimals: 6,
            isStable: true,
            reputationMultiplier: 0.8 // Stablecoins have lower reputation multiplier
        });
    }

    /**
     * Route payment through the most appropriate token
     * @param amount Payment amount
     * @param recipient Recipient's public key
     * @param payer Payer's public key
     * @param serviceDescription Description of the service
     * @param preferredToken Preferred token for payment (optional)
     * @returns Payment routing result
     */
    public async routePayment(
        amount: number,
        recipient: PublicKey,
        payer: PublicKey,
        serviceDescription: string,
        preferredToken?: string
    ): Promise<PaymentRoutingResult> {
        try {
            // Verify payer's reputation
            const reputationScore = await this.verifyPayerReputation(payer);
            
            // Determine best token for payment
            const tokenInfo = this.selectBestToken(amount, reputationScore, preferredToken);
            
            // Calculate adjusted amount based on reputation and token
            const adjustedAmount = this.calculateAdjustedAmount(amount, reputationScore, tokenInfo);
            
            // Generate x402 payment request
            const paymentRequestHeader = this.x402.generatePaymentRequest(
                adjustedAmount,
                recipient,
                serviceDescription
            );
            
            // Parse the payment request for validation
            const paymentRequest = this.x402.parsePaymentRequest(paymentRequestHeader);
            
            if (!paymentRequest) {
                return {
                    success: false,
                    error: 'Failed to generate payment request',
                    paymentRequest: null,
                    tokenUsed: null,
                    adjustedAmount: 0
                };
            }
            
            return {
                success: true,
                error: null,
                paymentRequest: paymentRequest,
                tokenUsed: tokenInfo.mint,
                adjustedAmount: adjustedAmount
            };
        } catch (error) {
            console.error('Error routing payment:', error);
            return {
                success: false,
                error: 'Payment routing failed',
                paymentRequest: null,
                tokenUsed: null,
                adjustedAmount: 0
            };
        }
    }

    /**
     * Verify payer's reputation for trust-based payment routing
     * @param payer Payer's public key
     * @returns Reputation score
     */
    private async verifyPayerReputation(payer: PublicKey): Promise<number> {
        try {
            // Get reputation score from PoHW attestation
            const attestation = await this.sdk.pohw.getHumanWorkAttestation(payer);
            if (attestation && attestation.qualityScore) {
                return attestation.qualityScore;
            }
            
            // Fallback to identity reputation if available
            try {
                const identity = await this.sdk.identity.getIdentity(payer);
                if (identity && identity.reputation) {
                    return identity.reputation;
                }
            } catch (error) {
                // Ignore identity error if PoHW is not available
            }
            
            // Default reputation score
            return 5000;
        } catch (error) {
            console.error('Error verifying payer reputation:', error);
            return 5000; // Default score
        }
    }

    /**
     * Select the best token for payment based on amount, reputation, and preference
     * @param amount Payment amount
     * @param reputationScore Payer's reputation score
     * @param preferredToken Preferred token (optional)
     * @returns Selected token information
     */
    private selectBestToken(amount: number, reputationScore: number, preferredToken?: string): TokenInfo {
        // If preferred token is specified and supported, use it
        if (preferredToken && this.supportedTokens.has(preferredToken)) {
            const tokenInfo = this.supportedTokens.get(preferredToken)!;
            return {
                ...tokenInfo,
                mint: preferredToken
            };
        }
        
        // For high reputation users, prefer $AXIOM token for higher rewards
        if (reputationScore >= 8000) {
            const axiomToken = this.supportedTokens.get(this.axiomTokenMint)!;
            return {
                ...axiomToken,
                mint: this.axiomTokenMint
            };
        }
        
        // For medium reputation users, use stablecoins for predictability
        if (reputationScore >= 5000) {
            // Find a supported stablecoin
            for (const [mint, tokenInfo] of this.supportedTokens.entries()) {
                if (tokenInfo.isStable) {
                    return {
                        ...tokenInfo,
                        mint: mint
                    };
                }
            }
        }
        
        // For lower reputation users, use the most stable option
        for (const [mint, tokenInfo] of this.supportedTokens.entries()) {
            if (tokenInfo.isStable) {
                return {
                    ...tokenInfo,
                    mint: mint
                };
            }
        }
        
        // Fallback to $AXIOM token
        const axiomToken = this.supportedTokens.get(this.axiomTokenMint)!;
        return {
            ...axiomToken,
            mint: this.axiomTokenMint
        };
    }

    /**
     * Calculate adjusted payment amount based on reputation and token
     * @param amount Original payment amount
     * @param reputationScore Payer's reputation score
     * @param tokenInfo Token information
     * @returns Adjusted payment amount
     */
    private calculateAdjustedAmount(amount: number, reputationScore: number, tokenInfo: TokenInfo): number {
        // Base multiplier based on reputation (0.5 to 2.0)
        const reputationMultiplier = 0.5 + (1.5 * (reputationScore / 10000));
        
        // Token-specific multiplier
        const tokenMultiplier = tokenInfo.reputationMultiplier;
        
        // Calculate final adjusted amount
        const adjustedAmount = amount * reputationMultiplier * tokenMultiplier;
        
        return adjustedAmount;
    }

    /**
     * Process payment with x402 verification
     * @param paymentRequest Payment request
     * @param payer Payer's public key
     * @returns Payment processing result
     */
    public async processPaymentWithVerification(paymentRequest: any, payer: PublicKey): Promise<PaymentProcessingResult> {
        try {
            // Verify and process payment through x402 protocol
            const serviceResponse = await this.x402.verifyAndProcessPayment(paymentRequest, payer);
            
            if (!serviceResponse) {
                return {
                    success: false,
                    error: 'Payment verification failed',
                    transactionId: null,
                    receipt: null
                };
            }
            
            if (!serviceResponse.success) {
                return {
                    success: false,
                    error: serviceResponse.error || 'Service processing failed',
                    transactionId: null,
                    receipt: null
                };
            }
            
            // Create payment receipt
            const receipt = this.x402.createPaymentReceipt(paymentRequest, serviceResponse);
            
            return {
                success: true,
                error: null,
                transactionId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                receipt: receipt
            };
        } catch (error) {
            console.error('Error processing payment with verification:', error);
            return {
                success: false,
                error: 'Payment processing failed',
                transactionId: null,
                receipt: null
            };
        }
    }

    /**
     * Get supported tokens
     * @returns Array of supported tokens
     */
    public getSupportedTokens(): SupportedToken[] {
        const tokens: SupportedToken[] = [];
        for (const [mint, tokenInfo] of this.supportedTokens.entries()) {
            tokens.push({
                mint: mint,
                name: tokenInfo.name,
                symbol: tokenInfo.symbol,
                decimals: tokenInfo.decimals,
                isStable: tokenInfo.isStable
            });
        }
        return tokens;
    }

    /**
     * Add supported token
     * @param mint Token mint address
     * @param tokenInfo Token information
     */
    public addSupportedToken(mint: string, tokenInfo: TokenInfo) {
        this.supportedTokens.set(mint, {
            ...tokenInfo,
            mint: mint
        });
    }
}

// Type definitions
interface TokenInfo {
    mint?: string;
    name: string;
    symbol: string;
    decimals: number;
    isStable: boolean;
    reputationMultiplier: number;
}

interface SupportedToken {
    mint: string;
    name: string;
    symbol: string;
    decimals: number;
    isStable: boolean;
}

interface PaymentRoutingResult {
    success: boolean;
    error: string | null;
    paymentRequest: any | null;
    tokenUsed: string | null;
    adjustedAmount: number;
}

interface PaymentProcessingResult {
    success: boolean;
    error: string | null;
    transactionId: string | null;
    receipt: any | null;
}