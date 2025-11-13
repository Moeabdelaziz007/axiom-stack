import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';

// Define types based on what we know from the program
type AxiomPoHW = any;

type WorkRecord = {
  worker: PublicKey;
  workData: string;
  verified: boolean;
  rewardClaimed: boolean;
  createdAt: BN;
};

export class PoHWClient {
  private connection: Connection;
  private provider: AnchorProvider;
  private axiomPoHWProgram: Program<AxiomPoHW> | null = null;

  constructor(connection: Connection, provider: AnchorProvider) {
    this.connection = connection;
    this.provider = provider;
  }

  initialize(axiomPoHWProgram: Program<AxiomPoHW>) {
    this.axiomPoHWProgram = axiomPoHWProgram;
  }

  /**
   * Submit proof of work for verification
   * @param workData Data about the work completed
   * @returns Transaction signature
   */
  async submitProofOfWork(workData: string): Promise<string> {
    if (!this.axiomPoHWProgram) {
      throw new Error('Axiom PoHW program not initialized');
    }

    try {
      // Get the user's public key
      const userPublicKey = this.provider.wallet.publicKey;
      
      // Find the PDA for the work record
      const [workRecordPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("work"), userPublicKey.toBuffer()],
        this.axiomPoHWProgram.programId
      );
      
      // Create the transaction
      const tx = await this.axiomPoHWProgram.methods
        .submitProofOfWork(workData)
        .accounts({
          user: userPublicKey,
          workRecord: workRecordPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      return tx;
    } catch (error) {
      console.error('Failed to submit proof of work:', error);
      throw error;
    }
  }

  /**
   * Verify proof of work
   * @param workId ID of the work to verify
   * @returns Verification result
   */
  async verifyProofOfWork(workId: PublicKey): Promise<boolean> {
    if (!this.axiomPoHWProgram) {
      throw new Error('Axiom PoHW program not initialized');
    }

    try {
      // Fetch the work record
      const workRecord = await this.axiomPoHWProgram.account.workRecord.fetch(workId) as WorkRecord;
      return workRecord.verified;
    } catch (error) {
      console.error('Failed to verify proof of work:', error);
      return false;
    }
  }

  /**
   * Get work rewards
   * @param workId ID of the work to claim rewards for
   * @returns Transaction signature
   */
  async getWorkRewards(workId: PublicKey): Promise<string> {
    if (!this.axiomPoHWProgram) {
      throw new Error('Axiom PoHW program not initialized');
    }

    try {
      // Get the user's public key
      const userPublicKey = this.provider.wallet.publicKey;
      
      // Create the transaction to claim rewards
      const tx = await this.axiomPoHWProgram.methods
        .claimRewards()
        .accounts({
          user: userPublicKey,
          workRecord: workId,
        })
        .rpc();
      
      return tx;
    } catch (error) {
      console.error('Failed to get work rewards:', error);
      throw error;
    }
  }
}