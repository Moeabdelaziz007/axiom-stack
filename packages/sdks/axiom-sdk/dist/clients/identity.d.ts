import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { AxiomId } from '../types';
export declare class IdentityClient {
    private connection;
    private provider;
    private axiomIdProgram;
    constructor(connection: Connection, provider: AnchorProvider);
    initialize(axiomIdProgram: Program<AxiomId>): void;
    createIdentity(persona: string, stakeAmount: number): Promise<string>;
    getIdentity(authority: PublicKey): Promise<unknown>;
    createSoulBoundToken(recipient: PublicKey, amount: number): Promise<string>;
    stake(amount: number): Promise<string>;
    requestAttestation(schema: string, data: string): Promise<string>;
    getReputationScore(agent: PublicKey): Promise<number>;
    presentCredentials(credentials: any): Promise<boolean>;
}
//# sourceMappingURL=identity.d.ts.map