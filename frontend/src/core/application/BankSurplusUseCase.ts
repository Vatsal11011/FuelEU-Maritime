// Core layer - NO React dependencies
import type { BankRequest } from '../domain/Banking';
import type { IBankingRepository } from '../ports/outbound/IBankingRepository';

export class BankSurplusUseCase {
  private bankingRepository: IBankingRepository;

  constructor(bankingRepository: IBankingRepository) {
    this.bankingRepository = bankingRepository;
  }

  async execute(request: BankRequest): Promise<void> {
    if (request.amount <= 0) {
      throw new Error('Amount to bank must be positive');
    }
    return await this.bankingRepository.bankSurplus(request);
  }
}

