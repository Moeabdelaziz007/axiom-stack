import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
type AxiomStaking = any;
export declare class StakingClient {
    private connection;
    private provider;
    private axiomStakingProgram;
    constructor(connection: Connection, provider: AnchorProvider);
    initialize(axiomStakingProgram: Program<AxiomStaking>): void;
    stakeTokens(amount: number): Promise<string>;
    getStakedAmount(agent: PublicKey): Promise<number>;
    unstakeTokens(amount: number): Promise<string>;
}
export {};
//# sourceMappingURL=staking.d.ts.map