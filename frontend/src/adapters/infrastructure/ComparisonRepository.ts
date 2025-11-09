import type { RouteComparison } from '../../core/domain/RouteComparison';
import type { IComparisonRepository } from '../../core/ports/outbound/IComparisonRepository';
import type { IApiClient } from '../../core/ports/outbound/IApiClient';

export class ComparisonRepository implements IComparisonRepository {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getComparisons(): Promise<RouteComparison[]> {
    return await this.apiClient.get<RouteComparison[]>('/routes/comparison');
  }
}

