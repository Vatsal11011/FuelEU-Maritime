// Core layer - NO React dependencies
// Domain entity for Route
export interface Route {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO₂e/MJ
  fuelConsumption: number; // t (tons)
  distance: number; // km
  totalEmissions: number; // t (tons)
}


