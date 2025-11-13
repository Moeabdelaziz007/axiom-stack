"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoHWClient = void 0;
const web3_js_1 = require("@solana/web3.js");
class PoHWClient {
    constructor(connection, provider) {
        this.axiomPoHWProgram = null;
        this.connection = connection;
        this.provider = provider;
    }
    initialize(axiomPoHWProgram) {
        this.axiomPoHWProgram = axiomPoHWProgram;
    }
    async submitProofOfWork(workData) {
        if (!this.axiomPoHWProgram) {
            throw new Error('Axiom PoHW program not initialized');
        }
        try {
            const userPublicKey = this.provider.wallet.publicKey;
            const [workRecordPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("work"), userPublicKey.toBuffer()], this.axiomPoHWProgram.programId);
            const tx = await this.axiomPoHWProgram.methods
                .submitProofOfWork(workData)
                .accounts({
                user: userPublicKey,
                workRecord: workRecordPda,
                systemProgram: web3_js_1.SystemProgram.programId,
            })
                .rpc();
            return tx;
        }
        catch (error) {
            console.error('Failed to submit proof of work:', error);
            throw error;
        }
    }
    async verifyProofOfWork(workId) {
        if (!this.axiomPoHWProgram) {
            throw new Error('Axiom PoHW program not initialized');
        }
        try {
            const workRecord = await this.axiomPoHWProgram.account.workRecord.fetch(workId);
            return workRecord.verified;
        }
        catch (error) {
            console.error('Failed to verify proof of work:', error);
            return false;
        }
    }
    async getWorkRewards(workId) {
        if (!this.axiomPoHWProgram) {
            throw new Error('Axiom PoHW program not initialized');
        }
        try {
            const userPublicKey = this.provider.wallet.publicKey;
            const tx = await this.axiomPoHWProgram.methods
                .claimRewards()
                .accounts({
                user: userPublicKey,
                workRecord: workId,
            })
                .rpc();
            return tx;
        }
        catch (error) {
            console.error('Failed to get work rewards:', error);
            throw error;
        }
    }
}
exports.PoHWClient = PoHWClient;
//# sourceMappingURL=pohw.js.map