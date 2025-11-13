// Type definitions for Axiom Stack programs

export type AxiomId = any;
export type AxiomStaking = any;
export type AxiomPoHW = any;
export type AxiomAttestations = any;
export type ZentixProtocol = any;

// Identity types
export interface IdentityAccount {
  authority: string;
  persona: string;
  stakeAmount: number;
  reputation: number;
  bump: number;
}

// Staking types
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

// PoHW types
export interface WorkSubmission {
  worker: string;
  workData: string;
  qualityScore: number;
  isVerified: boolean;
  rewardAmount: number;
  bump: number;
}

// Attestation types
export interface Attestation {
  subject: string;
  issuer: string;
  claim: string;
  evidence: string;
  expiration: number;
  isRevoked: boolean;
  bump: number;
}

// Zentix types
export interface FlashLoanRequest {
  borrower: string;
  tokenMint: string;
  amount: number;
  repaymentAmount: number;
}
