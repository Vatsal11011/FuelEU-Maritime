// Core layer - NO React dependencies
import type { ComplianceBalance } from '../domain/Banking';
import type { IBankingRepository } from '../ports/outbound/IBankingRepository';

export class GetComplianceBalanceUseCase {
  private bankingRepository: IBankingRepository;

  constructor(bankingRepository: IBankingRepository) {
    this.bankingRepository = bankingRepository;
  }

  async execute(year: number): Promise<ComplianceBalance> {
    return await this.bankingRepository.getComplianceBalance(year);
  }
}

