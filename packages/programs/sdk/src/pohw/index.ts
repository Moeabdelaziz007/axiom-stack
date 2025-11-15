import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';

// Placeholder types
type AxiomPoHW = any;

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
   * Record human work attestation
   * @param user Public key of the user
   * @param workData Work data to record
   * @returns Transaction signature
   */
  async recordHumanWork(user: PublicKey, workData: any): Promise<string> {
    if (!this.axiomPoHWProgram) {
      throw new Error('Axiom PoHW program not initialized');
    }

    // Find the schema PDA
    const [schemaPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pohw-schema")],
      this.axiomPoHWProgram.programId
    );

    // Find the attestation PDA
    const [attestationPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("pohw-attestation"),
        schemaPda.toBuffer(),
        user.toBuffer()
      ],
      this.axiomPoHWProgram.programId
    );

    // Use a more generic approach to avoid TypeScript errors
    const tx = await (this.axiomPoHWProgram as any).methods
      .recordHumanWork(workData)
      .accounts({
        payer: this.provider.wallet.publicKey,
        user: user,
        schema: schemaPda,
        attestation: attestationPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  /**
   * Update human work attestation
   * @param user Public key of the user
   * @param workData Updated work data
   * @returns Transaction signature
   */
  async updateHumanWork(user: PublicKey, workData: any): Promise<string> {
    if (!this.axiomPoHWProgram) {
      throw new Error('Axiom PoHW program not initialized');
    }

    // Find the schema PDA
    const [schemaPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pohw-schema")],
      this.axiomPoHWProgram.programId
    );

    // Find the attestation PDA
    const [attestationPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("pohw-attestation"),
        schemaPda.toBuffer(),
        user.toBuffer()
      ],
      this.axiomPoHWProgram.programId
    );

    // Use a more generic approach to avoid TypeScript errors
    const tx = await (this.axiomPoHWProgram as any).methods
      .updateHumanWork(workData)
      .accounts({
        payer: this.provider.wallet.publicKey,
        user: user,
        schema: schemaPda,
        attestation: attestationPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  /**
   * Get human work attestation for a user
   * @param user Public key of the user
   * @returns Attestation data
   */
  async getHumanWorkAttestation(user: PublicKey): Promise<any> {
    if (!this.axiomPoHWProgram) {
      throw new Error('Axiom PoHW program not initialized');
    }

    // Find the schema PDA
    const [schemaPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pohw-schema")],
      this.axiomPoHWProgram.programId
    );

    // Find the attestation PDA
    const [attestationPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("pohw-attestation"),
        schemaPda.toBuffer(),
        user.toBuffer()
      ],
      this.axiomPoHWProgram.programId
    );

    try {
      // Use a more generic approach to avoid TypeScript errors
      const attestation = await (this.axiomPoHWProgram.account as any).humanWorkAttestation.fetch(attestationPda);
      return attestation;
    } catch (error) {
      console.error('Error fetching attestation:', error);
      return null;
    }
  }
}