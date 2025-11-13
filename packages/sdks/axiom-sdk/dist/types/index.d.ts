export type AxiomId = any;
export type AxiomStaking = any;
export type AxiomPoHW = any;
export type AxiomAttestations = any;
export type ZentixProtocol = any;
export interface AgentMetadata {
    did: string;
    soulMint: string;
    agentPda: string;
    version: number;
    bump: number;
}
export interface AxiomAiIdentity {
    authority: string;
    persona: string;
    reputation: number;
    createdAt: number;
    stakeAmount: number;
    isSoulBound: boolean;
}
export interface StakingPool {
    authority: string;
    stakedTokenMint: string;
    rewardTokenMint: string;
    rewardRate: number;
    totalStaked: number;
    totalEffectiveStaked: number;
    accRewardPerShare: number;
    lastRewardTime: number;
}
export interface UserStake {
    amount: number;
    effectiveAmount: number;
    rewardDebt: number;
    reputationScore: number;
    positiveAttestations: number;
    isColdStart: boolean;
    coldStartTimestamp: number;
}
export interface WorkSubmission {
    worker: string;
    workData: string;
    qualityScore: number;
    isVerified: boolean;
    rewardAmount: number;
    bump: number;
}
export interface Attestation {
    subject: string;
    issuer: string;
    claim: string;
    evidence: string;
    expiration: number;
    isRevoked: boolean;
    bump: number;
}
export interface FlashLoanRequest {
    borrower: string;
    tokenMint: string;
    amount: number;
    repaymentAmount: number;
}
//# sourceMappingURL=index.d.ts.map