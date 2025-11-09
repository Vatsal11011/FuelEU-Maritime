// Core layer - NO React dependencies
import type { RouteComparison } from '../../domain/RouteComparison';

export interface IComparisonRepository {
  getComparisons(): Promise<RouteComparison[]>;
}

