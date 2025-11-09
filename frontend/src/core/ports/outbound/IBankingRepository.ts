// Core layer - NO React dependencies
import type { ComplianceBalance } from '../../domain/Banking';
import type { BankRequest } from '../../domain/Banking';
import type { ApplyRequest } from '../../domain/Banking';

export interface IBankingRepository {
  getComplianceBalance(year: number): Promise<ComplianceBalance>;
  bankSurplus(request: BankRequest): Promise<void>;
  applyBankedSurplus(request: ApplyRequest): Promise<void>;
}

