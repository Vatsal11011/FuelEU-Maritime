// Core layer - NO React dependencies
import type { RouteComparison } from '../domain/RouteComparison';
import type { IComparisonRepository } from '../ports/outbound/IComparisonRepository';

const TARGET_GHG_INTENSITY = 89.3368; // 2% below 91.16 gCO₂e/MJ

export class GetComparisonsUseCase {
  private comparisonRepository: IComparisonRepository;

  constructor(comparisonRepository: IComparisonRepository) {
    this.comparisonRepository = comparisonRepository;
  }

  async execute(): Promise<RouteComparison[]> {
    const comparisons = await this.comparisonRepository.getComparisons();
    
    // Calculate percent difference and compliance for each comparison
    return comparisons.map((comp) => {
      const percentDiff = ((comp.comparison.ghgIntensity / comp.baseline.ghgIntensity) - 1) * 100;
      const compliant = comp.comparison.ghgIntensity <= TARGET_GHG_INTENSITY;
      
      return {
        ...comp,
        percentDifference: percentDiff,
        compliant,
      };
    });
  }
}

