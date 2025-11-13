"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingClient = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
class StakingClient {
    constructor(connection, provider) {
        this.axiomStakingProgram = null;
        this.connection = connection;
        this.provider = provider;
    }
    initialize(axiomStakingProgram) {
        this.axiomStakingProgram = axiomStakingProgram;
    }
    /**
     * Stake tokens for an agent
     * @param amount Amount of tokens to stake
     * @returns Transaction signature
     */
    async stakeTokens(amount) {
        if (!this.axiomStakingProgram) {
            throw new Error('Axiom Staking program not initialized');
        }
        try {
            // Get the user's public key
            const userPublicKey = this.provider.wallet.publicKey;
            // Find the PDA for the stake account
            const [stakeAccountPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("stake"), userPublicKey.toBuffer()], this.axiomStakingProgram.programId);
            // Create the transaction
            const tx = await this.axiomStakingProgram.methods
                .stakeTokens(new anchor_1.BN(amount))
                .accounts({
                user: userPublicKey,
                stakeAccount: stakeAccountPda,
                tokenProgram: web3_js_1.SystemProgram.programId,
            })
                .rpc();
            return tx;
        }
        catch (error) {
            console.error('Failed to stake tokens:', error);
            throw error;
        }
    }
    /**
     * Get staked amount for an agent
     * @param agent Public key of the agent
     * @returns Staked amount
     */
    async getStakedAmount(agent) {
        if (!this.axiomStakingProgram) {
            throw new Error('Axiom Staking program not initialized');
        }
        try {
            // Find the PDA for the stake account
            const [stakeAccountPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("stake"), agent.toBuffer()], this.axiomStakingProgram.programId);
            // Fetch the account data
            const stakeAccount = await this.axiomStakingProgram.account.stakeAccount.fetch(stakeAccountPda);
            return stakeAccount.amount.toNumber();
        }
        catch (error) {
            console.error('Failed to fetch staked amount:', error);
            return 0;
        }
    }
    /**
     * Unstake tokens for an agent
     * @param amount Amount of tokens to unstake
     * @returns Transaction signature
     */
    async unstakeTokens(amount) {
        if (!this.axiomStakingProgram) {
            throw new Error('Axiom Staking program not initialized');
        }
        try {
            // Get the user's public key
            const userPublicKey = this.provider.wallet.publicKey;
            // Find the PDA for the stake account
            const [stakeAccountPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("stake"), userPublicKey.toBuffer()], this.axiomStakingProgram.programId);
            // Create the transaction
            const tx = await this.axiomStakingProgram.methods
                .unstakeTokens(new anchor_1.BN(amount))
                .accounts({
                user: userPublicKey,
                stakeAccount: stakeAccountPda,
                tokenProgram: web3_js_1.SystemProgram.programId,
            })
                .rpc();
            return tx;
        }
        catch (error) {
            console.error('Failed to unstake tokens:', error);
            throw error;
        }
    }
}
exports.StakingClient = StakingClient;
