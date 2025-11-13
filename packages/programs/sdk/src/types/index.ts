// Basic types for the Axiom ID SDK

export interface AxiomIdentity {
  authority: string;
  persona: string;
  did: string;
  createdAt: number;
  lastActive: number;
  isActive: boolean;
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

export interface Attestation {
  issuer: string;
  subject: string;
  schema: string;
  data: string;
  issuedAt: number;
  expiresAt?: number;
  revoked: boolean;
}

export interface PaymentChannel {
  sender: string;
  recipient: string;
  limit: number;
  balance: number;
  expiration: number;
  closed: boolean;
}

export interface EscrowPayment {
  sender: string;
  recipient: string;
  arbiter: string;
  amount: number;
  released: boolean;
  disputed: boolean;
}

export interface SlashRecord {
  user: string;
  amount: number;
  reason: string;
  timestamp: number;
}

// Configuration interfaces
export interface AxiomSDKConfig {
  connection: string;
  wallet: any;
  programs?: {
    axiomId?: string;
    agentSoulFactory?: string;
    axiomStaking?: string;
    axiomAttestations?: string;
    axiomPayments?: string;
    axiomSlashing?: string;
    axiomToken?: string;
    axiomGovernance?: string;
  };
}

// Result types
export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
}

export interface BalanceResult {
  balance: number;
  decimals: number;
}

export interface ReputationResult {
  score: number;
  rank: number;
  percentile: number;
}