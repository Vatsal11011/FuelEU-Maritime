import type { Ship } from '../../core/domain/Pooling';
import type { Pool } from '../../core/domain/Pooling';
import type { CreatePoolRequest } from '../../core/domain/Pooling';
import type { IPoolingRepository } from '../../core/ports/outbound/IPoolingRepository';
import type { IApiClient } from '../../core/ports/outbound/IApiClient';

export class PoolingRepository implements IPoolingRepository {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getAdjustedComplianceBalance(year: number): Promise<Ship[]> {
    return await this.apiClient.get<Ship[]>(`/compliance/adjusted-cb?year=${year}`);
  }

  async createPool(request: CreatePoolRequest): Promise<Pool> {
    return await this.apiClient.post<Pool>('/pools', request);
  }
}

