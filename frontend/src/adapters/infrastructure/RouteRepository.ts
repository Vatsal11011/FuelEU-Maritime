import type { Route } from '../../core/domain/Route';
import type { IRouteRepository } from '../../core/ports/outbound/IRouteRepository';
import type { IApiClient } from '../../core/ports/outbound/IApiClient';

export class RouteRepository implements IRouteRepository {
  private apiClient: IApiClient;
  
  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getAllRoutes(): Promise<Route[]> {
    return await this.apiClient.get<Route[]>('/routes');
  }

  async setBaseline(routeId: string): Promise<void> {
    await this.apiClient.post(`/routes/${routeId}/baseline`, {});
  }
}

