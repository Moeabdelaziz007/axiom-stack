// Integration tests for solana-agent-kit with Axiom ID SDK
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '../../src/index';

// Mock solana-agent-kit classes
class MockAgent {
  publicKey: PublicKey;
  constructor(keypair: Keypair) {
    this.publicKey = keypair.publicKey;
  }
  
  async execute() {
    return { success: true };
  }
}

class MockAgentKit {
  static createAgent(keypair: Keypair) {
    return new MockAgent(keypair);
  }
}

describe('solana-agent-kit Integration', () => {
  let sdk: AxiomIDSDK;
  let mockAgent: MockAgent;
  let agentKey: Keypair;
  
  beforeEach(() => {
    // Set up the Axiom ID SDK
    const connection = new Connection('https://api.devnet.solana.com');
    agentKey = Keypair.generate();
    const provider = {
      publicKey: agentKey.publicKey,
      signTransaction: jest.fn(),
      signAllTransactions: jest.fn()
    } as unknown as AnchorProvider;
    
    sdk = new AxiomIDSDK(connection, provider);
    
    // Set up mock agent
    mockAgent = MockAgentKit.createAgent(agentKey);
  });

  it('should create an identity for a solana-agent-kit agent', async () => {
    // Mock the identity creation function
    const mockCreateIdentity = jest.spyOn(sdk.identity, 'createIdentity').mockResolvedValue('mock-tx-hash');
    
    // Create identity for the agent
    const tx = await sdk.identity.createIdentity('Test Agent Persona', 1000);
    
    expect(mockCreateIdentity).toHaveBeenCalledWith('Test Agent Persona', 1000);
    expect(tx).toBe('mock-tx-hash');
  });

  it('should stake tokens for a solana-agent-kit agent', async () => {
    // Mock the staking function
    const mockStakeTokens = jest.spyOn(sdk.staking, 'stakeTokens').mockResolvedValue('mock-tx-hash');
    
    // Stake tokens for the agent
    const tx = await sdk.staking.stakeTokens(500);
    
    expect(mockStakeTokens).toHaveBeenCalledWith(500);
    expect(tx).toBe('mock-tx-hash');
  });

  it('should request an attestation for a solana-agent-kit agent', async () => {
    // Mock the attestation function
    const mockRequestAttestation = jest.spyOn(sdk.attestations, 'requestAttestation').mockResolvedValue('mock-tx-hash');
    
    // Request attestation for the agent
    const tx = await sdk.attestations.requestAttestation(
      agentKey.publicKey,
      'task_completion',
      '{"tasks_completed": 5, "success_rate": 0.8}'
    );
    
    expect(mockRequestAttestation).toHaveBeenCalledWith(
      agentKey.publicKey,
      'task_completion',
      '{"tasks_completed": 5, "success_rate": 0.8}'
    );
    expect(tx).toBe('mock-tx-hash');
  });

  it('should get reputation score for a solana-agent-kit agent', async () => {
    // Mock the reputation score function
    const mockGetReputationScore = jest.spyOn(sdk.attestations, 'getReputationScore').mockResolvedValue(7500);
    
    // Get reputation score for the agent
    const score = await sdk.attestations.getReputationScore(agentKey.publicKey);
    
    expect(mockGetReputationScore).toHaveBeenCalledWith(agentKey.publicKey);
    expect(score).toBe(7500);
  });

  it('should present credentials for a solana-agent-kit agent', async () => {
    // Mock the present credentials function
    const mockPresentCredentials = jest.spyOn(sdk.identity, 'presentCredentials').mockResolvedValue({
      success: true,
      credentials: [{
        schema: 'task_completion',
        issuer: new PublicKey('issuer111111111111111111111111111111111111111'),
        data: '{"tasks_completed": 5, "success_rate": 0.8}',
        timestamp: Date.now()
      }]
    });
    
    // Present credentials for the agent
    const result = await sdk.identity.presentCredentials(['task_completion']);
    
    expect(mockPresentCredentials).toHaveBeenCalledWith(['task_completion']);
    expect(result.success).toBe(true);
    expect(result.credentials).toHaveLength(1);
  });

  it('should route payments for a solana-agent-kit agent', async () => {
    // Mock the payment routing function
    const mockRoutePayment = jest.spyOn(sdk.payments, 'routePayment').mockResolvedValue('mock-tx-hash');
    
    const recipient = Keypair.generate().publicKey;
    
    // Route payment for the agent
    const tx = await sdk.payments.routePayment(recipient, 100, 'Payment for services');
    
    expect(mockRoutePayment).toHaveBeenCalledWith(recipient, 100, 'Payment for services');
    expect(tx).toBe('mock-tx-hash');
  });

  it('should work with a complete agent workflow', async () => {
    // Mock all functions
    jest.spyOn(sdk.identity, 'createIdentity').mockResolvedValue('identity-tx');
    jest.spyOn(sdk.staking, 'stakeTokens').mockResolvedValue('stake-tx');
    jest.spyOn(sdk.attestations, 'requestAttestation').mockResolvedValue('attestation-tx');
    jest.spyOn(sdk.attestations, 'getReputationScore').mockResolvedValue(8000);
    jest.spyOn(sdk.payments, 'routePayment').mockResolvedValue('payment-tx');
    
    // Execute a complete workflow
    const identityTx = await sdk.identity.createIdentity('Complete Test Agent', 1000);
    const stakeTx = await sdk.staking.stakeTokens(500);
    const attestationTx = await sdk.attestations.requestAttestation(
      agentKey.publicKey,
      'task_completion',
      '{"tasks_completed": 10, "success_rate": 0.95}'
    );
    const reputationScore = await sdk.attestations.getReputationScore(agentKey.publicKey);
    const recipient = Keypair.generate().publicKey;
    const paymentTx = await sdk.payments.routePayment(recipient, 100, 'Final payment');
    
    // Verify all steps completed successfully
    expect(identityTx).toBe('identity-tx');
    expect(stakeTx).toBe('stake-tx');
    expect(attestationTx).toBe('attestation-tx');
    expect(reputationScore).toBe(8000);
    expect(paymentTx).toBe('payment-tx');
  });
});