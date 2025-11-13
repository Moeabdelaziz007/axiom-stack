import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
type AxiomPoHW = any;
export declare class PoHWClient {
    private connection;
    private provider;
    private axiomPoHWProgram;
    constructor(connection: Connection, provider: AnchorProvider);
    initialize(axiomPoHWProgram: Program<AxiomPoHW>): void;
    submitProofOfWork(workData: string): Promise<string>;
    verifyProofOfWork(workId: PublicKey): Promise<boolean>;
    getWorkRewards(workId: PublicKey): Promise<string>;
}
export {};
//# sourceMappingURL=pohw.d.ts.map