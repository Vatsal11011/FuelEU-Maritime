// Core layer - NO React dependencies
import type { ApplyRequest } from '../domain/Banking';
import type { IBankingRepository } from '../ports/outbound/IBankingRepository';

export class ApplyBankedSurplusUseCase {
  private bankingRepository: IBankingRepository;

  constructor(bankingRepository: IBankingRepository) {
    this.bankingRepository = bankingRepository;
  }

  async execute(request: ApplyRequest): Promise<void> {
    if (request.amount <= 0) {
      throw new Error('Amount to apply must be positive');
    }
    return await this.bankingRepository.applyBankedSurplus(request);
  }
}

