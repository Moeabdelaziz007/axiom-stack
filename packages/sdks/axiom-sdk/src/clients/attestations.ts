import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';

// Define types based on what we know from the program
type AxiomAttestations = any;

type Attestation = {
  subject: PublicKey;
  issuer: PublicKey;
  schema: string;
  data: string;
  createdAt: BN;
};

export class AttestationClient {
  private connection: Connection;
  private provider: AnchorProvider;
  private axiomAttestationsProgram: Program<AxiomAttestations> | null = null;

  constructor(connection: Connection, provider: AnchorProvider) {
    this.connection = connection;
    this.provider = provider;
  }

  initialize(axiomAttestationsProgram: Program<AxiomAttestations>) {
    this.axiomAttestationsProgram = axiomAttestationsProgram;
  }

  /**
   * Create an attestation for an agent
   * @param subject Public key of the subject being attested
   * @param claim The claim being made
   * @param evidence Evidence supporting the claim
   * @returns Transaction signature
   */
  async requestAttestation(subject: PublicKey, claim: string, evidence: string): Promise<string> {
    if (!this.axiomAttestationsProgram) {
      throw new Error('Axiom Attestations program not initialized');
    }

    try {
      // Get the user's public key (attester)
      const attesterPublicKey = this.provider.wallet.publicKey;
      
      // Find the PDA for the attestation
      const [attestationPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("attestation"), attesterPublicKey.toBuffer(), subject.toBuffer()],
        this.axiomAttestationsProgram.programId
      );
      
      // Create the transaction
      const tx = await this.axiomAttestationsProgram.methods
        .createAttestation(subject, claim, evidence)
        .accounts({
          attester: attesterPublicKey,
          attestation: attestationPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      return tx;
    } catch (error) {
      console.error('Failed to create attestation:', error);
      throw error;
    }
  }

  /**
   * Verify an attestation
   * @param attestationId ID of the attestation to verify
   * @returns Verification result
   */
  async verifyAttestation(attestationId: PublicKey): Promise<boolean> {
    if (!this.axiomAttestationsProgram) {
      throw new Error('Axiom Attestations program not initialized');
    }

    try {
      // Fetch the attestation
      const attestation = await this.axiomAttestationsProgram.account.attestation.fetch(attestationId) as Attestation;
      // In a real implementation, we would verify the attestation
      return true;
    } catch (error) {
      console.error('Failed to verify attestation:', error);
      return false;
    }
  }

  /**
   * Revoke an attestation
   * @param attestationId ID of the attestation to revoke
   * @returns Transaction signature
   */
  async revokeAttestation(attestationId: PublicKey): Promise<string> {
    if (!this.axiomAttestationsProgram) {
      throw new Error('Axiom Attestations program not initialized');
    }

    try {
      // Get the user's public key
      const userPublicKey = this.provider.wallet.publicKey;
      
      // Create the transaction to revoke the attestation
      const tx = await this.axiomAttestationsProgram.methods
        .revokeAttestation()
        .accounts({
          issuer: userPublicKey,
          attestation: attestationId,
        })
        .rpc();
      
      return tx;
    } catch (error) {
      console.error('Failed to revoke attestation:', error);
      throw error;
    }
  }
}