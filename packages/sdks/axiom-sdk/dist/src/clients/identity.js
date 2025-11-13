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
    /**
     * Create a new AI agent identity with NTT minting and Cryptid account creation
     * @param persona Description of the AI agent
     * @param stakeAmount Amount of tokens to stake
     * @returns Transaction signature
     */
    async createIdentity(persona, stakeAmount) {
        if (!this.axiomIdProgram) {
            throw new Error('Axiom ID program not initialized');
        }
        try {
            // Get the user's public key (payer)
            const userPublicKey = this.provider.wallet.publicKey;
            // Find the PDA for the identity account
            const [identityPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("axiom-identity"), userPublicKey.toBuffer()], this.axiomIdProgram.programId);
            // Create the transaction instruction
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
    /**
     * Get an existing AI agent identity
     * @param authority Public key of the identity owner
     * @returns Identity account data
     */
    async getIdentity(authority) {
        if (!this.axiomIdProgram) {
            throw new Error('Axiom ID program not initialized');
        }
        try {
            // Find the PDA for the identity account
            const [identityPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("axiom-identity"), authority.toBuffer()], this.axiomIdProgram.programId);
            // Fetch the account data
            const identityAccount = await this.axiomIdProgram.account.axiomAiIdentity.fetch(identityPda);
            return identityAccount;
        }
        catch (error) {
            console.error('Failed to fetch identity account:', error);
            return null;
        }
    }
    /**
     * Create a soul-bound token for an agent
     * @param recipient Public key of the token recipient
     * @param amount Amount of tokens to mint
     * @returns Transaction signature
     */
    async createSoulBoundToken(recipient, amount) {
        if (!this.axiomIdProgram) {
            throw new Error('Axiom ID program not initialized');
        }
        try {
            // Find the PDA for the agent metadata
            const [agentMetadataPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("agent"), recipient.toBuffer()], this.axiomIdProgram.programId);
            // Create the transaction
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
    /**
     * Stake $AXIOM tokens for an agent identity
     * @param amount Amount of tokens to stake
     * @returns Transaction signature
     */
    async stake(amount) {
        // This would integrate with the staking program
        // For now, we'll simulate the call
        console.log(`Staking ${amount} tokens for agent`);
        return "transaction_signature_mock";
    }
    /**
     * Request an attestation for an agent through SAS
     * @param schema Schema for the attestation
     * @param data Attestation data
     * @returns Transaction signature
     */
    async requestAttestation(schema, data) {
        // This would integrate with the attestations program
        // For now, we'll simulate the call
        console.log(`Requesting attestation with schema: ${schema}`);
        return "transaction_signature_mock";
    }
    /**
     * Get reputation score for an agent from the staking contract
     * @param agent Public key of the agent
     * @returns Reputation score
     */
    async getReputationScore(agent) {
        // This would integrate with the staking program to fetch reputation
        // For now, we'll simulate the call
        return 100;
    }
    /**
     * Present credentials for verification
     * @param credentials Credential data to present
     * @returns Verification result
     */
    async presentCredentials(credentials) {
        // This would integrate with the attestations program to verify credentials
        // For now, we'll simulate the call
        return true;
    }
}
exports.IdentityClient = IdentityClient;
