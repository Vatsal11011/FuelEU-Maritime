// Core layer - NO React dependencies
// Domain entity for Route Comparison
export interface RouteComparison {
  routeId: string;
  baseline: {
    ghgIntensity: number; // gCO₂e/MJ
  };
  comparison: {
    ghgIntensity: number; // gCO₂e/MJ
  };
  percentDifference: number; // calculated: ((comparison / baseline) - 1) * 100
  compliant: boolean; // true if comparison <= target (89.3368 gCO₂e/MJ)
}

