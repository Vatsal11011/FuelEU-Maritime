// Core layer - NO React dependencies
// Domain entity for Banking (Fuel EU Article 20)
export interface ComplianceBalance {
  year: number;
  cb_before: number; // Compliance Balance before operations
  applied: number; // Amount applied from banked surplus
  cb_after: number; // Compliance Balance after operations
  bankedSurplus: number; // Total banked surplus available
}

export interface BankRequest {
  amount: number; // Amount to bank (must be positive CB)
}

export interface ApplyRequest {
  amount: number; // Amount to apply from banked surplus
  year: number; // Year to apply to
}

