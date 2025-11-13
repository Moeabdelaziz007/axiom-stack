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
    async stakeTokens(amount) {
        if (!this.axiomStakingProgram) {
            throw new Error('Axiom Staking program not initialized');
        }
        try {
            const userPublicKey = this.provider.wallet.publicKey;
            const [stakeAccountPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("stake"), userPublicKey.toBuffer()], this.axiomStakingProgram.programId);
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
    async getStakedAmount(agent) {
        if (!this.axiomStakingProgram) {
            throw new Error('Axiom Staking program not initialized');
        }
        try {
            const [stakeAccountPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("stake"), agent.toBuffer()], this.axiomStakingProgram.programId);
            const stakeAccount = await this.axiomStakingProgram.account.stakeAccount.fetch(stakeAccountPda);
            return stakeAccount.amount.toNumber();
        }
        catch (error) {
            console.error('Failed to fetch staked amount:', error);
            return 0;
        }
    }
    async unstakeTokens(amount) {
        if (!this.axiomStakingProgram) {
            throw new Error('Axiom Staking program not initialized');
        }
        try {
            const userPublicKey = this.provider.wallet.publicKey;
            const [stakeAccountPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("stake"), userPublicKey.toBuffer()], this.axiomStakingProgram.programId);
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
//# sourceMappingURL=staking.js.map