// Core layer - NO React dependencies
import type { Ship } from '../domain/Pooling';
import type { IPoolingRepository } from '../ports/outbound/IPoolingRepository';

export class GetAdjustedCBUseCase {
  private poolingRepository: IPoolingRepository;

  constructor(poolingRepository: IPoolingRepository) {
    this.poolingRepository = poolingRepository;
  }

  async execute(year: number): Promise<Ship[]> {
    return await this.poolingRepository.getAdjustedComplianceBalance(year);
  }
}

