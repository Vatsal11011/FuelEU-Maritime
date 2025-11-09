import type { RouteComparison } from '../../core/domain/RouteComparison';
import type { IComparisonRepository } from '../../core/ports/outbound/IComparisonRepository';

export class MockComparisonRepository implements IComparisonRepository {
  private mockComparisons: Omit<RouteComparison, 'percentDifference' | 'compliant'>[] = [
    {
      routeId: 'R001',
      baseline: {
        ghgIntensity: 91.0,
      },
      comparison: {
        ghgIntensity: 89.5,
      },
    },
    {
      routeId: 'R002',
      baseline: {
        ghgIntensity: 88.0,
      },
      comparison: {
        ghgIntensity: 87.2,
      },
    },
    {
      routeId: 'R003',
      baseline: {
        ghgIntensity: 93.5,
      },
      comparison: {
        ghgIntensity: 90.8,
      },
    },
    {
      routeId: 'R004',
      baseline: {
        ghgIntensity: 89.2,
      },
      comparison: {
        ghgIntensity: 88.5,
      },
    },
    {
      routeId: 'R005',
      baseline: {
        ghgIntensity: 90.5,
      },
      comparison: {
        ghgIntensity: 89.0,
      },
    },
  ];

  async getComparisons(): Promise<RouteComparison[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Return with placeholder values for percentDifference and compliant
    // These will be calculated in the use case
    return this.mockComparisons.map((comp) => ({
      ...comp,
      percentDifference: 0, // Will be calculated in use case
      compliant: false, // Will be calculated in use case
    }));
  }
}

