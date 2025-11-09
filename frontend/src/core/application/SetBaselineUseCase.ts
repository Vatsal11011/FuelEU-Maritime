// Core layer - NO React dependencies
import type { IRouteRepository } from '../ports/outbound/IRouteRepository';

export class SetBaselineUseCase {
  private routeRepository: IRouteRepository;
  
  constructor(routeRepository: IRouteRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(routeId: string): Promise<void> {
    return await this.routeRepository.setBaseline(routeId);
  }
}


