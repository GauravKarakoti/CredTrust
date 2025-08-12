// The structure of a processed Loan object for the UI
export interface Loan {
  id: number;
  amount: string;
  interestRate: bigint;
  duration: bigint;
  collateralized: boolean;
}

// The structure of a processed Attestation object for the UI
export interface Attestation {
  attester: string;
  amount: string;
  timestamp: string;
}

// A helper type for the raw struct data returned from the LoanContract
export type LoanStruct = readonly [
  amount: bigint,
  interestRate: bigint,
  duration: bigint,
  collateralized: boolean
];

// A helper type for the raw struct data returned from the CredTrustRegistry
export type AttestationStruct = readonly [
  attester: string,
  amount: bigint,
  timestamp: bigint
];