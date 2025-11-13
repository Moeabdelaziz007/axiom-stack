// Example of using Axiom ID Payment Router
import { PublicKey } from '@solana/web3.js';
import { AxiomIDSDK } from '../../sdk/src/index';
import { PaymentRouter } from './payment-router';

// Example showing the Payment Routing workflow
class PaymentRoutingExample {
    private sdk: AxiomIDSDK;
    private paymentRouter: PaymentRouter;
    private axiomTokenMint: string;

    constructor(sdk: AxiomIDSDK, axiomTokenMint: string) {
        this.sdk = sdk;
        this.axiomTokenMint = axiomTokenMint;
        this.paymentRouter = new PaymentRouter(sdk, axiomTokenMint);
    }

    /**
     * Complete workflow for payment routing with reputation-based trust verification
     */
    async runPaymentRoutingWorkflow() {
        try {
            console.log('Starting Axiom ID Payment Routing Workflow');
            console.log('========================================');

            // 1. Route payment for high reputation user
            console.log('1. Routing payment for high reputation user...');
            
            const highReputationUser = new PublicKey('highRep1111111111111111111111111111111111');
            const recipient = new PublicKey('recipient1111111111111111111111111111111111');
            
            const highRepResult = await this.paymentRouter.routePayment(
                1000, // 1000 tokens
                recipient,
                highReputationUser,
                'AI model inference service',
            );
            
            if (highRepResult.success) {
                console.log(`   Payment routed successfully using token: ${highRepResult.tokenUsed}`);
                console.log(`   Adjusted amount: ${highRepResult.adjustedAmount}`);
                console.log(`   Payment request: ${JSON.stringify(highRepResult.paymentRequest)}`);
            } else {
                console.log(`   Payment routing failed: ${highRepResult.error}`);
            }

            // 2. Route payment for medium reputation user
            console.log('2. Routing payment for medium reputation user...');
            
            const mediumReputationUser = new PublicKey('medRep1111111111111111111111111111111111');
            
            const medRepResult = await this.paymentRouter.routePayment(
                500, // 500 tokens
                recipient,
                mediumReputationUser,
                'Data processing service',
            );
            
            if (medRepResult.success) {
                console.log(`   Payment routed successfully using token: ${medRepResult.tokenUsed}`);
                console.log(`   Adjusted amount: ${medRepResult.adjustedAmount}`);
            } else {
                console.log(`   Payment routing failed: ${medRepResult.error}`);
            }

            // 3. Route payment with preferred token
            console.log('3. Routing payment with preferred token (USDC)...');
            
            const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
            
            const preferredTokenResult = await this.paymentRouter.routePayment(
                250, // 250 tokens
                recipient,
                highReputationUser,
                'Storage service',
                usdcMint // Preferred token
            );
            
            if (preferredTokenResult.success) {
                console.log(`   Payment routed successfully using preferred token: ${preferredTokenResult.tokenUsed}`);
                console.log(`   Adjusted amount: ${preferredTokenResult.adjustedAmount}`);
            } else {
                console.log(`   Payment routing failed: ${preferredTokenResult.error}`);
            }

            // 4. Process payment with verification
            console.log('4. Processing payment with reputation-based verification...');
            
            if (highRepResult.paymentRequest) {
                const processingResult = await this.paymentRouter.processPaymentWithVerification(
                    highRepResult.paymentRequest,
                    highReputationUser
                );
                
                if (processingResult.success) {
                    console.log(`   Payment processed successfully with transaction: ${processingResult.transactionId}`);
                    console.log(`   Receipt: ${JSON.stringify(processingResult.receipt)}`);
                } else {
                    console.log(`   Payment processing failed: ${processingResult.error}`);
                }
            }

            // 5. Get supported tokens
            console.log('5. Retrieving supported tokens...');
            const supportedTokens = this.paymentRouter.getSupportedTokens();
            console.log(`   Supported tokens: ${supportedTokens.map(t => t.symbol).join(', ')}`);

            console.log('\nPayment routing workflow completed successfully!');
            return true;
        } catch (error) {
            console.error('Error in payment routing workflow:', error);
            return false;
        }
    }
}

// Example usage
async function main() {
    // Initialize connection and provider
    // const connection = new Connection('https://api.devnet.solana.com');
    // const provider = new AnchorProvider(connection, wallet, opts);
    
    // For this example, we'll use a mock SDK
    const mockSDK: any = {
        pohw: {
            getHumanWorkAttestation: async (user: PublicKey) => {
                // Mock implementation - return different reputation scores based on user
                if (user.toString().includes('highRep')) {
                    return { qualityScore: 9000 };
                } else if (user.toString().includes('medRep')) {
                    return { qualityScore: 6000 };
                } else {
                    return { qualityScore: 5000 };
                }
            }
        },
        identity: {
            getIdentity: async (user: PublicKey) => {
                // Mock implementation
                return { reputation: 5000 };
            }
        }
    };

    const axiomTokenMint = 'AXioMtoken111111111111111111111111111111111';
    
    // Initialize the payment router
    const paymentRoutingExample = new PaymentRoutingExample(mockSDK, axiomTokenMint);

    // Run the payment routing workflow
    await paymentRoutingExample.runPaymentRoutingWorkflow();
}

// Run the example
main().catch(console.error);

export { PaymentRoutingExample };