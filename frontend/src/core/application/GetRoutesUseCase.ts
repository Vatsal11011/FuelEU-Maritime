// Core layer - NO React dependencies
import type { Route } from '../domain/Route';
import type { IRouteRepository } from '../ports/outbound/IRouteRepository';

export class GetRoutesUseCase {
  private routeRepository: IRouteRepository;
  
  constructor(routeRepository: IRouteRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(): Promise<Route[]> {
    return await this.routeRepository.getAllRoutes();
  }
}


