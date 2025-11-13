// Test file for Payment Router
import { PublicKey } from '@solana/web3.js';
import { PaymentRouter } from './payment-router';

// Mock AxiomIDSDK
const mockSDK: any = {
    pohw: {
        getHumanWorkAttestation: jest.fn()
    },
    identity: {
        getIdentity: jest.fn()
    }
};

describe('PaymentRouter', () => {
    let paymentRouter: PaymentRouter;
    const axiomTokenMint = 'AXioMtoken111111111111111111111111111111111';

    beforeEach(() => {
        paymentRouter = new PaymentRouter(mockSDK, axiomTokenMint);
    });

    it('should initialize with supported tokens', () => {
        const tokens = paymentRouter.getSupportedTokens();
        expect(tokens.length).toBeGreaterThan(0);
        expect(tokens.some(token => token.symbol === 'AXIOM')).toBe(true);
    });

    it('should route payment with high reputation user', async () => {
        const payer = new PublicKey('payer111111111111111111111111111111111111');
        const recipient = new PublicKey('recipient1111111111111111111111111111111111');
        
        // Mock high reputation score
        mockSDK.pohw.getHumanWorkAttestation.mockResolvedValue({
            qualityScore: 9000
        });
        
        const result = await paymentRouter.routePayment(
            100,
            recipient,
            payer,
            'Test service'
        );
        
        expect(result.success).toBe(true);
        expect(result.tokenUsed).toBe(axiomTokenMint);
        expect(result.adjustedAmount).toBeGreaterThan(100); // Should be boosted
    });

    it('should route payment with medium reputation user using stablecoin', async () => {
        const payer = new PublicKey('payer111111111111111111111111111111111111');
        const recipient = new PublicKey('recipient1111111111111111111111111111111111');
        
        // Mock medium reputation score
        mockSDK.pohw.getHumanWorkAttestation.mockResolvedValue({
            qualityScore: 6000
        });
        
        const result = await paymentRouter.routePayment(
            100,
            recipient,
            payer,
            'Test service'
        );
        
        expect(result.success).toBe(true);
        expect(result.tokenUsed).not.toBe(axiomTokenMint); // Should use stablecoin
        expect(result.adjustedAmount).toBeGreaterThan(100); // Should still be boosted
    });

    it('should route payment with low reputation user using stablecoin', async () => {
        const payer = new PublicKey('payer111111111111111111111111111111111111');
        const recipient = new PublicKey('recipient1111111111111111111111111111111111');
        
        // Mock low reputation score
        mockSDK.pohw.getHumanWorkAttestation.mockResolvedValue({
            qualityScore: 3000
        });
        
        const result = await paymentRouter.routePayment(
            100,
            recipient,
            payer,
            'Test service'
        );
        
        expect(result.success).toBe(true);
        expect(result.tokenUsed).not.toBe(axiomTokenMint); // Should use stablecoin
        expect(result.adjustedAmount).toBeLessThan(100); // Should be reduced
    });

    it('should handle preferred token selection', async () => {
        const payer = new PublicKey('payer111111111111111111111111111111111111');
        const recipient = new PublicKey('recipient1111111111111111111111111111111111');
        const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        
        // Mock high reputation score
        mockSDK.pohw.getHumanWorkAttestation.mockResolvedValue({
            qualityScore: 9000
        });
        
        const result = await paymentRouter.routePayment(
            100,
            recipient,
            payer,
            'Test service',
            usdcMint // Preferred token
        );
        
        expect(result.success).toBe(true);
        expect(result.tokenUsed).toBe(usdcMint); // Should use preferred token
    });

    it('should process payment with verification', async () => {
        const payer = new PublicKey('payer111111111111111111111111111111111111');
        const paymentRequest = {
            amount: 100,
            recipient: new PublicKey('recipient1111111111111111111111111111111111'),
            token: axiomTokenMint,
            description: 'Test service',
            timestamp: Date.now(),
            protocol: 'x402'
        };
        
        // Mock successful payment verification
        mockSDK.pohw.getHumanWorkAttestation.mockResolvedValue({
            qualityScore: 8000
        });
        
        const result = await paymentRouter.processPaymentWithVerification(paymentRequest, payer);
        
        expect(result.success).toBe(true);
        expect(result.transactionId).not.toBeNull();
        expect(result.receipt).not.toBeNull();
    });
});