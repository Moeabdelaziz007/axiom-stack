import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';

// Define types based on what we know from the program
type AxiomStaking = any;

type StakeAccount = {
  owner: PublicKey;
  amount: BN;
  createdAt: BN;
};

export class StakingClient {
  private connection: Connection;
  private provider: AnchorProvider;
  private axiomStakingProgram: Program<AxiomStaking> | null = null;

  constructor(connection: Connection, provider: AnchorProvider) {
    this.connection = connection;
    this.provider = provider;
  }

  initialize(axiomStakingProgram: Program<AxiomStaking>) {
    this.axiomStakingProgram = axiomStakingProgram;
  }

  /**
   * Stake tokens for an agent
   * @param amount Amount of tokens to stake
   * @returns Transaction signature
   */
  async stakeTokens(amount: number): Promise<string> {
    if (!this.axiomStakingProgram) {
      throw new Error('Axiom Staking program not initialized');
    }

    try {
      // Get the user's public key
      const userPublicKey = this.provider.wallet.publicKey;
      
      // Find the PDA for the stake account
      const [stakeAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), userPublicKey.toBuffer()],
        this.axiomStakingProgram.programId
      );
      
      // Create the transaction
      const tx = await this.axiomStakingProgram.methods
        .stakeTokens(new BN(amount))
        .accounts({
          user: userPublicKey,
          stakeAccount: stakeAccountPda,
          tokenProgram: SystemProgram.programId,
        })
        .rpc();
      
      return tx;
    } catch (error) {
      console.error('Failed to stake tokens:', error);
      throw error;
    }
  }

  /**
   * Get staked amount for an agent
   * @param agent Public key of the agent
   * @returns Staked amount
   */
  async getStakedAmount(agent: PublicKey): Promise<number> {
    if (!this.axiomStakingProgram) {
      throw new Error('Axiom Staking program not initialized');
    }

    try {
      // Find the PDA for the stake account
      const [stakeAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), agent.toBuffer()],
        this.axiomStakingProgram.programId
      );
      
      // Fetch the account data
      const stakeAccount = await this.axiomStakingProgram.account.stakeAccount.fetch(stakeAccountPda) as StakeAccount;
      return stakeAccount.amount.toNumber();
    } catch (error) {
      console.error('Failed to fetch staked amount:', error);
      return 0;
    }
  }

  /**
   * Unstake tokens for an agent
   * @param amount Amount of tokens to unstake
   * @returns Transaction signature
   */
  async unstakeTokens(amount: number): Promise<string> {
    if (!this.axiomStakingProgram) {
      throw new Error('Axiom Staking program not initialized');
    }

    try {
      // Get the user's public key
      const userPublicKey = this.provider.wallet.publicKey;
      
      // Find the PDA for the stake account
      const [stakeAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), userPublicKey.toBuffer()],
        this.axiomStakingProgram.programId
      );
      
      // Create the transaction
      const tx = await this.axiomStakingProgram.methods
        .unstakeTokens(new BN(amount))
        .accounts({
          user: userPublicKey,
          stakeAccount: stakeAccountPda,
          tokenProgram: SystemProgram.programId,
        })
        .rpc();
      
      return tx;
    } catch (error) {
      console.error('Failed to unstake tokens:', error);
      throw error;
    }
  }
}