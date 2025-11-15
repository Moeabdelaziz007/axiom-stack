import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
type AxiomAttestations = any;
export declare class AttestationClient {
    private connection;
    private provider;
    private axiomAttestationsProgram;
    constructor(connection: Connection, provider: AnchorProvider);
    initialize(axiomAttestationsProgram: Program<AxiomAttestations>): void;
    requestAttestation(subject: PublicKey, claim: string, evidence: string): Promise<string>;
    verifyAttestation(attestationId: PublicKey): Promise<boolean>;
    revokeAttestation(attestationId: PublicKey): Promise<string>;
}
export {};
//# sourceMappingURL=attestations.d.ts.map