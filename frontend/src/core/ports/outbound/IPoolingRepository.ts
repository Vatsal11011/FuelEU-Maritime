// Core layer - NO React dependencies
import type { Ship } from '../../domain/Pooling';
import type { Pool } from '../../domain/Pooling';
import type { CreatePoolRequest } from '../../domain/Pooling';

export interface IPoolingRepository {
  getAdjustedComplianceBalance(year: number): Promise<Ship[]>;
  createPool(request: CreatePoolRequest): Promise<Pool>;
}

