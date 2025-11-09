import type { Route } from '../../core/domain/Route';
import type { IRouteRepository } from '../../core/ports/outbound/IRouteRepository';

export class MockRouteRepository implements IRouteRepository {
  private mockRoutes: Route[] = [
    {
      routeId: 'R001',
      vesselType: 'Container',
      fuelType: 'HFO',
      year: 2024,
      ghgIntensity: 91.0,
      fuelConsumption: 5000,
      distance: 12000,
      totalEmissions: 4500,
    },
    {
      routeId: 'R002',
      vesselType: 'BulkCarrier',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4200,
    },
    {
      routeId: 'R003',
      vesselType: 'Tanker',
      fuelType: 'MGO',
      year: 2024,
      ghgIntensity: 93.5,
      fuelConsumption: 5100,
      distance: 12500,
      totalEmissions: 4700,
    },
    {
      routeId: 'R004',
      vesselType: 'RoRo',
      fuelType: 'HFO',
      year: 2025,
      ghgIntensity: 89.2,
      fuelConsumption: 4900,
      distance: 11800,
      totalEmissions: 4300,
    },
    {
      routeId: 'R005',
      vesselType: 'Container',
      fuelType: 'LNG',
      year: 2025,
      ghgIntensity: 90.5,
      fuelConsumption: 4950,
      distance: 11900,
      totalEmissions: 4400,
    },
  ];

  async getAllRoutes(): Promise<Route[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...this.mockRoutes];
  }

  async setBaseline(routeId: string): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const route = this.mockRoutes.find((r) => r.routeId === routeId);
    if (!route) {
      throw new Error(`Route ${routeId} not found`);
    }
    // In a real implementation, this would call the API
    console.log(`Baseline set for route ${routeId}`);
  }
}

