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
    async requestAttestation(schema, data) {
        if (!this.axiomAttestationsProgram) {
            throw new Error('Axiom Attestations program not initialized');
        }
        try {
            const userPublicKey = this.provider.wallet.publicKey;
            const [attestationPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("attestation"), userPublicKey.toBuffer()], this.axiomAttestationsProgram.programId);
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
    async verifyAttestation(attestationId) {
        if (!this.axiomAttestationsProgram) {
            throw new Error('Axiom Attestations program not initialized');
        }
        try {
            const attestation = await this.axiomAttestationsProgram.account.attestation.fetch(attestationId);
            return true;
        }
        catch (error) {
            console.error('Failed to verify attestation:', error);
            return false;
        }
    }
    async revokeAttestation(attestationId) {
        if (!this.axiomAttestationsProgram) {
            throw new Error('Axiom Attestations program not initialized');
        }
        try {
            const userPublicKey = this.provider.wallet.publicKey;
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
//# sourceMappingURL=attestations.js.map