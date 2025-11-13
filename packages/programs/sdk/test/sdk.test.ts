import { AxiomIDSDK } from '../src/index';
import { Connection } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';

describe('AxiomIDSDK', () => {
  let sdk: AxiomIDSDK;
  
  beforeEach(() => {
    // Mock connection and provider
    const connection = new Connection('https://api.devnet.solana.com');
    const provider = {} as AnchorProvider;
    
    sdk = new AxiomIDSDK(connection, provider);
  });

  it('should initialize with all client modules', () => {
    expect(sdk.identity).toBeDefined();
    expect(sdk.staking).toBeDefined();
    expect(sdk.attestations).toBeDefined();
    expect(sdk.payments).toBeDefined();
    expect(sdk.slashing).toBeDefined();
  });

  it('should have the correct client types', () => {
    expect(typeof sdk.identity).toBe('object');
    expect(typeof sdk.staking).toBe('object');
    expect(typeof sdk.attestations).toBe('object');
    expect(typeof sdk.payments).toBe('object');
    expect(typeof sdk.slashing).toBe('object');
  });
});