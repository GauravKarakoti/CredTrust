export interface Loan {
  id: number;
  amount: string;
  interestRate: bigint;
  duration: bigint;
  collateralized: boolean;
}

export interface Attestation {
  attester: string;
  amount: string;
  timestamp: string;
}