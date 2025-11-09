// Core layer - NO React dependencies
import type { Route } from '../../domain/Route';

export interface IRouteRepository {
  getAllRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
}


