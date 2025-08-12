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

// NEW: Type for Recharts data
export interface ChartDataPoint {
  name: string;
  value: number;
}

// Helper types for raw contract returns
export type LoanStruct = readonly [
  amount: bigint,
  interestRate: bigint,
  duration: bigint,
  collateralized: boolean
];

export type AttestationStruct = readonly [
  attester: string,
  amount: bigint,
  timestamp: bigint
];