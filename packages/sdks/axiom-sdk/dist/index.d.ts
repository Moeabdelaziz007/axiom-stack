import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
type AxiomId = any;
type AxiomStaking = any;
type AxiomPoHW = any;
type AxiomAttestations = any;
type AgentSoulFactory = any;
import { IdentityClient } from './clients/identity';
import { StakingClient } from './clients/staking';
import { PoHWClient } from './clients/pohw';
import { AttestationClient } from './clients/attestations';
import { ZentixClient } from './clients/zentix';
export declare const PROGRAM_IDS: {
    AXIOM_ID: PublicKey;
    AXIOM_STAKING: PublicKey;
    AXIOM_ATTESTATIONS: PublicKey;
    AXIOM_POHW: PublicKey;
    AGENT_SOUL_FACTORY: PublicKey;
    AXIOM_GOVERNANCE: PublicKey;
    AXIOM_PAYMENTS: PublicKey;
    AXIOM_SLASHING: PublicKey;
    AXIOM_TOKEN: PublicKey;
    AXIOM_STAKING_DYNAMIC: PublicKey;
};
export declare class AxiomStackSDK {
    private connection;
    private provider;
    identity: IdentityClient;
    staking: StakingClient;
    pohw: PoHWClient;
    attestations: AttestationClient;
    zentix: ZentixClient;
    constructor(connection: Connection, provider: AnchorProvider);
    initializePrograms(programs: {
        axiomIdProgram?: Program<AxiomId>;
        axiomStakingProgram?: Program<AxiomStaking>;
        axiomPoHWProgram?: Program<AxiomPoHW>;
        axiomAttestationsProgram?: Program<AxiomAttestations>;
        agentSoulFactoryProgram?: Program<AgentSoulFactory>;
    }): Promise<void>;
}
export * from './clients/identity';
export * from './clients/staking';
export * from './clients/pohw';
export * from './clients/attestations';
export * from './clients/zentix';
export * from './types';
export default AxiomStackSDK;
//# sourceMappingURL=index.d.ts.map