import type { Ship } from '../../core/domain/Pooling';
import type { Pool } from '../../core/domain/Pooling';
import type { CreatePoolRequest } from '../../core/domain/Pooling';
import type { IPoolingRepository } from '../../core/ports/outbound/IPoolingRepository';

export class MockPoolingRepository implements IPoolingRepository {
  private mockShips: Map<number, Ship[]> = new Map([
    [
      2024,
      [
        { shipId: 'S001', shipName: 'MV Container Express', adjustedCB: 150.5 },
        { shipId: 'S002', shipName: 'MV Bulk Carrier', adjustedCB: -50.2 },
        { shipId: 'S003', shipName: 'MV Tanker', adjustedCB: 200.8 },
        { shipId: 'S004', shipName: 'MV RoRo', adjustedCB: -30.5 },
        { shipId: 'S005', shipName: 'MV LNG Carrier', adjustedCB: 180.3 },
      ],
    ],
    [
      2025,
      [
        { shipId: 'S001', shipName: 'MV Container Express', adjustedCB: 120.0 },
        { shipId: 'S002', shipName: 'MV Bulk Carrier', adjustedCB: -80.0 },
        { shipId: 'S003', shipName: 'MV Tanker', adjustedCB: 250.0 },
        { shipId: 'S004', shipName: 'MV RoRo', adjustedCB: -40.0 },
        { shipId: 'S005', shipName: 'MV LNG Carrier', adjustedCB: 160.0 },
      ],
    ],
  ]);

  async getAdjustedComplianceBalance(year: number): Promise<Ship[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const ships = this.mockShips.get(year);
    if (!ships) {
      return [];
    }
    
    return [...ships];
  }

  async createPool(request: CreatePoolRequest): Promise<Pool> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // In a real implementation, this would call the API
    // For mock, we return a pool with calculated values
    const ships = this.mockShips.get(request.year) || [];
    const selectedShips = ships.filter((ship) => request.memberShipIds.includes(ship.shipId));
    const poolSum = selectedShips.reduce((sum, ship) => sum + ship.adjustedCB, 0);
    
    const members = selectedShips.map((ship) => ({
      shipId: ship.shipId,
      shipName: ship.shipName,
      cbBefore: ship.adjustedCB,
      cbAfter: ship.adjustedCB, // Backend would calculate actual distribution
    }));

    return {
      poolId: `POOL-${Date.now()}`,
      year: request.year,
      members,
      poolSum,
      isValid: poolSum >= 0,
    };
  }
}

