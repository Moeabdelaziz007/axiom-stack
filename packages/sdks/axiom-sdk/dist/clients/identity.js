"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityClient = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
class IdentityClient {
    constructor(connection, provider) {
        this.axiomIdProgram = null;
        this.connection = connection;
        this.provider = provider;
    }
    initialize(axiomIdProgram) {
        this.axiomIdProgram = axiomIdProgram;
    }
    async createIdentity(persona, stakeAmount) {
        if (!this.axiomIdProgram) {
            throw new Error('Axiom ID program not initialized');
        }
        try {
            const userPublicKey = this.provider.wallet.publicKey;
            const [identityPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("axiom-identity"), userPublicKey.toBuffer()], this.axiomIdProgram.programId);
            const tx = await this.axiomIdProgram.methods
                .createIdentity(persona, new anchor_1.BN(stakeAmount))
                .accounts({
                identityAccount: identityPda,
                user: userPublicKey,
                systemProgram: web3_js_1.SystemProgram.programId,
            })
                .rpc();
            return tx;
        }
        catch (error) {
            console.error('Failed to create identity:', error);
            throw error;
        }
    }
    async getIdentity(authority) {
        if (!this.axiomIdProgram) {
            throw new Error('Axiom ID program not initialized');
        }
        try {
            const [identityPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("axiom-identity"), authority.toBuffer()], this.axiomIdProgram.programId);
            const identityAccount = await this.axiomIdProgram.account.axiomAiIdentity.fetch(identityPda);
            return identityAccount;
        }
        catch (error) {
            console.error('Failed to fetch identity account:', error);
            return null;
        }
    }
    async createSoulBoundToken(recipient, amount) {
        if (!this.axiomIdProgram) {
            throw new Error('Axiom ID program not initialized');
        }
        try {
            const [agentMetadataPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("agent"), recipient.toBuffer()], this.axiomIdProgram.programId);
            const tx = await this.axiomIdProgram.methods
                .mintSoulToAgent()
                .accounts({
                agentMetadata: agentMetadataPda,
            })
                .rpc();
            return tx;
        }
        catch (error) {
            console.error('Failed to create soul-bound token:', error);
            throw error;
        }
    }
    async stake(amount) {
        console.log(`Staking ${amount} tokens for agent`);
        return "transaction_signature_mock";
    }
    async requestAttestation(schema, data) {
        console.log(`Requesting attestation with schema: ${schema}`);
        return "transaction_signature_mock";
    }
    async getReputationScore(agent) {
        return 100;
    }
    async presentCredentials(credentials) {
        return true;
    }
}
exports.IdentityClient = IdentityClient;
//# sourceMappingURL=identity.js.map