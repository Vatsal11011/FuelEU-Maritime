import React, { useState, useEffect, useMemo } from 'react';
import type { Route } from '../../../core/domain/Route';
import type { RouteFilters } from '../../../shared/types';
import { GetRoutesUseCase } from '../../../core/application/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../../core/application/SetBaselineUseCase';
// Using mock repository for test data - switch to RouteRepository when API is ready
import { MockRouteRepository } from '../../../adapters/infrastructure/MockRouteRepository';
// import { RouteRepository } from '../../../adapters/infrastructure/RouteRepository';
// import { ApiClient } from '../../../adapters/infrastructure/ApiClient';

export const RoutesTab: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({});
  const [processingBaseline, setProcessingBaseline] = useState<string | null>(null);

  // Initialize use cases with mock repository (memoized to avoid recreating)
  const { getRoutesUseCase, setBaselineUseCase } = useMemo(() => {
    const routeRepository = new MockRouteRepository();
    // For real API: const apiClient = new ApiClient('http://your-api-url');
    // const routeRepository = new RouteRepository(apiClient);
    return {
      getRoutesUseCase: new GetRoutesUseCase(routeRepository),
      setBaselineUseCase: new SetBaselineUseCase(routeRepository),
    };
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRoutesUseCase.execute();
        setRoutes(data);
        setFilteredRoutes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch routes');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [getRoutesUseCase]);

  // Apply filters
  useEffect(() => {
    let filtered = [...routes];

    if (filters.vesselType) {
      filtered = filtered.filter((r) => r.vesselType === filters.vesselType);
    }
    if (filters.fuelType) {
      filtered = filtered.filter((r) => r.fuelType === filters.fuelType);
    }
    if (filters.year) {
      filtered = filtered.filter((r) => r.year === filters.year);
    }

    setFilteredRoutes(filtered);
  }, [filters, routes]);

  const handleSetBaseline = async (routeId: string) => {
    try {
      setProcessingBaseline(routeId);
      await setBaselineUseCase.execute(routeId);
      // Optionally refresh routes or show success message
      alert(`Baseline set for route ${routeId}`);
    } catch (err) {
      alert(`Failed to set baseline: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setProcessingBaseline(null);
    }
  };

  const handleFilterChange = (key: keyof RouteFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  // Get unique values for filter dropdowns
  const uniqueVesselTypes = Array.from(new Set(routes.map((r) => r.vesselType))).sort();
  const uniqueFuelTypes = Array.from(new Set(routes.map((r) => r.fuelType))).sort();
  const uniqueYears = Array.from(new Set(routes.map((r) => r.year))).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Routes</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Loading routes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Routes</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Routes</h3>
              <p className="text-red-700 mb-2">{error}</p>
              <p className="text-sm text-red-600 mt-4">
                <strong>Possible causes:</strong>
              </p>
              <ul className="text-sm text-red-600 list-disc list-inside mt-2 space-y-1">
                <li>API server is not running</li>
                <li>API endpoint <code className="bg-red-100 px-1 rounded">/routes</code> does not exist</li>
                <li>API base URL is not configured correctly</li>
                <li>CORS issues preventing the request</li>
              </ul>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Routes</h2>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vessel Type
              </label>
              <select
                value={filters.vesselType || ''}
                onChange={(e) => handleFilterChange('vesselType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Vessel Types</option>
                {uniqueVesselTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Type
              </label>
              <select
                value={filters.fuelType || ''}
                onChange={(e) => handleFilterChange('fuelType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Fuel Types</option>
                {uniqueFuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={filters.year || ''}
                onChange={(e) =>
                  handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vessel Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GHG Intensity (gCO₂e/MJ)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fuel Consumption (t)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance (km)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Emissions (t)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoutes.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      No routes found
                    </td>
                  </tr>
                ) : (
                  filteredRoutes.map((route) => (
                    <tr key={route.routeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {route.routeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {route.vesselType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {route.fuelType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {route.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {route.ghgIntensity.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {route.fuelConsumption.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {route.distance.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {route.totalEmissions.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleSetBaseline(route.routeId)}
                          disabled={processingBaseline === route.routeId}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {processingBaseline === route.routeId ? 'Setting...' : 'Set Baseline'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredRoutes.length} of {routes.length} routes
        </div>
      </div>
    </div>
  );
};
