import type { ComplianceBalance } from '../../core/domain/Banking';
import type { BankRequest } from '../../core/domain/Banking';
import type { ApplyRequest } from '../../core/domain/Banking';
import type { IBankingRepository } from '../../core/ports/outbound/IBankingRepository';
import type { IApiClient } from '../../core/ports/outbound/IApiClient';

export class BankingRepository implements IBankingRepository {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getComplianceBalance(year: number): Promise<ComplianceBalance> {
    return await this.apiClient.get<ComplianceBalance>(`/compliance/cb?year=${year}`);
  }

  async bankSurplus(request: BankRequest): Promise<void> {
    await this.apiClient.post('/banking/bank', request);
  }

  async applyBankedSurplus(request: ApplyRequest): Promise<void> {
    await this.apiClient.post('/banking/apply', request);
  }
}

