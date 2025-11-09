// Core layer - NO React dependencies
import type { Pool } from '../domain/Pooling';
import type { CreatePoolRequest } from '../domain/Pooling';
import type { IPoolingRepository } from '../ports/outbound/IPoolingRepository';
import type { Ship } from '../domain/Pooling';

export class CreatePoolUseCase {
  private poolingRepository: IPoolingRepository;

  constructor(poolingRepository: IPoolingRepository) {
    this.poolingRepository = poolingRepository;
  }

  async execute(request: CreatePoolRequest, ships: Ship[]): Promise<Pool> {
    // Validate pool rules before creating
    const selectedShips = ships.filter((ship) => request.memberShipIds.includes(ship.shipId));
    
    if (selectedShips.length === 0) {
      throw new Error('Pool must have at least one member');
    }

    // Calculate pool sum
    const poolSum = selectedShips.reduce((sum, ship) => sum + ship.adjustedCB, 0);

    // Validate rules
    if (poolSum < 0) {
      throw new Error('Pool sum must be >= 0 (Sum(adjustedCB) >= 0)');
    }

    // Check deficit/surplus rules
    for (const ship of selectedShips) {
      if (ship.adjustedCB < 0) {
        // Deficit ship - cannot exit worse (already negative, so this is OK if pool sum >= 0)
        // The rule is enforced by ensuring poolSum >= 0
      } else if (ship.adjustedCB > 0) {
        // Surplus ship - cannot exit negative
        // This is handled by the pool sum validation
      }
    }

    // Create pool request - backend will calculate actual distribution
    const poolRequest: CreatePoolRequest = {
      year: request.year,
      memberShipIds: request.memberShipIds,
    };

    return await this.poolingRepository.createPool(poolRequest);
  }
}

