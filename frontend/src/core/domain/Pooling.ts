// Core layer - NO React dependencies
// Domain entity for Pooling (Fuel EU Article 21)
export interface Ship {
  shipId: string;
  shipName: string;
  adjustedCB: number; // Adjusted Compliance Balance
}

export interface PoolMember {
  shipId: string;
  shipName: string;
  cbBefore: number; // CB before pooling
  cbAfter: number; // CB after pooling
}

export interface Pool {
  poolId?: string;
  year: number;
  members: PoolMember[];
  poolSum: number; // Sum of adjusted CBs
  isValid: boolean; // Valid if poolSum >= 0 and rules are met
}

export interface CreatePoolRequest {
  year: number;
  memberShipIds: string[];
}

