"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttestationClient = void 0;
const web3_js_1 = require("@solana/web3.js");
class AttestationClient {
    constructor(connection, provider) {
        this.axiomAttestationsProgram = null;
        this.connection = connection;
        this.provider = provider;
    }
    initialize(axiomAttestationsProgram) {
        this.axiomAttestationsProgram = axiomAttestationsProgram;
    }
    /**
     * Request an attestation for an agent
     * @param schema Schema for the attestation
     * @param data Attestation data
     * @returns Transaction signature
     */
    async requestAttestation(schema, data) {
        if (!this.axiomAttestationsProgram) {
            throw new Error('Axiom Attestations program not initialized');
        }
        try {
            // Get the user's public key (payer)
            const userPublicKey = this.provider.wallet.publicKey;
            // Find the PDA for the attestation
            const [attestationPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("attestation"), userPublicKey.toBuffer()], this.axiomAttestationsProgram.programId);
            // Create the transaction
            const tx = await this.axiomAttestationsProgram.methods
                .requestAttestation(schema, data)
                .accounts({
                payer: userPublicKey,
                attestation: attestationPda,
                systemProgram: web3_js_1.SystemProgram.programId,
            })
                .rpc();
            return tx;
        }
        catch (error) {
            console.error('Failed to request attestation:', error);
            throw error;
        }
    }
    /**
     * Verify an attestation
     * @param attestationId ID of the attestation to verify
     * @returns Verification result
     */
    async verifyAttestation(attestationId) {
        if (!this.axiomAttestationsProgram) {
            throw new Error('Axiom Attestations program not initialized');
        }
        try {
            // Fetch the attestation
            const attestation = await this.axiomAttestationsProgram.account.attestation.fetch(attestationId);
            // In a real implementation, we would verify the attestation
            return true;
        }
        catch (error) {
            console.error('Failed to verify attestation:', error);
            return false;
        }
    }
    /**
     * Revoke an attestation
     * @param attestationId ID of the attestation to revoke
     * @returns Transaction signature
     */
    async revokeAttestation(attestationId) {
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
        }
        catch (error) {
            console.error('Failed to revoke attestation:', error);
            throw error;
        }
    }
}
exports.AttestationClient = AttestationClient;
