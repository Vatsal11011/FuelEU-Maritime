// Shared types - NO React dependencies
export type TabId = 'routes' | 'compare' | 'banking' | 'pooling';

export interface TabConfig {
  id: TabId;
  label: string;
  path: string;
}

export interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}
