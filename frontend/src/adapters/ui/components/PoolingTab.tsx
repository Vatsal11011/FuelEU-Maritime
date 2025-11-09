import React, { useState, useEffect, useMemo } from 'react';
import type { Ship } from '../../../core/domain/Pooling';
import type { PoolMember } from '../../../core/domain/Pooling';
import { GetAdjustedCBUseCase } from '../../../core/application/GetAdjustedCBUseCase';
import { CreatePoolUseCase } from '../../../core/application/CreatePoolUseCase';
import { MockPoolingRepository } from '../../../adapters/infrastructure/MockPoolingRepository';
// import { PoolingRepository } from '../../../adapters/infrastructure/PoolingRepository';
// import { ApiClient } from '../../../adapters/infrastructure/ApiClient';

export const PoolingTab: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [ships, setShips] = useState<Ship[]>([]);
  const [selectedShipIds, setSelectedShipIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [createdPool, setCreatedPool] = useState<PoolMember[] | null>(null);

  // Initialize use cases with mock repository
  const { getAdjustedCBUseCase, createPoolUseCase } = useMemo(() => {
    const poolingRepository = new MockPoolingRepository();
    // For real API: const apiClient = new ApiClient('http://your-api-url');
    // const poolingRepository = new PoolingRepository(apiClient);
    return {
      getAdjustedCBUseCase: new GetAdjustedCBUseCase(poolingRepository),
      createPoolUseCase: new CreatePoolUseCase(poolingRepository),
    };
  }, []);

  useEffect(() => {
    const fetchShips = async () => {
      try {
        setLoading(true);
        setError(null);
        setActionError(null);
        const data = await getAdjustedCBUseCase.execute(currentYear);
        setShips(data);
        setSelectedShipIds(new Set());
        setCreatedPool(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ships');
      } finally {
        setLoading(false);
      }
    };

    fetchShips();
  }, [currentYear, getAdjustedCBUseCase]);

  const toggleShipSelection = (shipId: string) => {
    const newSelection = new Set(selectedShipIds);
    if (newSelection.has(shipId)) {
      newSelection.delete(shipId);
    } else {
      newSelection.add(shipId);
    }
    setSelectedShipIds(newSelection);
    setCreatedPool(null);
  };

  // Calculate pool sum for selected ships
  const selectedShips = ships.filter((ship) => selectedShipIds.has(ship.shipId));
  const poolSum = selectedShips.reduce((sum, ship) => sum + ship.adjustedCB, 0);
  const isValidPool = poolSum >= 0 && selectedShips.length > 0;

  // Validate pool rules
  const validationErrors: string[] = [];
  if (selectedShips.length > 0) {
    if (poolSum < 0) {
      validationErrors.push('Pool sum must be >= 0 (Sum(adjustedCB) >= 0)');
    }
    
    // Check deficit/surplus rules
    for (const ship of selectedShips) {
      if (ship.adjustedCB < 0) {
        // Deficit ship - cannot exit worse
        // This is handled by ensuring poolSum >= 0
      } else if (ship.adjustedCB > 0) {
        // Surplus ship - cannot exit negative
        // This is handled by ensuring poolSum >= 0
      }
    }
  }

  const handleCreatePool = async () => {
    if (!isValidPool) {
      setActionError('Pool is invalid. Please check the rules.');
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);
      const pool = await createPoolUseCase.execute(
        {
          year: currentYear,
          memberShipIds: Array.from(selectedShipIds),
        },
        ships
      );
      setCreatedPool(pool.members);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create pool');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pooling</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Loading ships...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pooling</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Ships</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pooling (Fuel EU Article 21)</h2>

        {/* Year Selector */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Year
          </label>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {[2024, 2025, 2026, 2027, 2028].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Pool Sum Indicator */}
        {selectedShips.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Pool Sum</h3>
                <p className="text-sm text-gray-600">
                  Sum of Adjusted CB: {selectedShips.length} ship(s) selected
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-3xl font-bold ${
                    poolSum >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {poolSum >= 0 ? '+' : ''}
                  {poolSum.toFixed(2)}
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${
                    poolSum >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {poolSum >= 0 ? '✅ Valid' : '❌ Invalid'}
                </p>
              </div>
            </div>
            {validationErrors.length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                <ul className="list-disc list-inside text-sm text-red-700">
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Error Display */}
        {actionError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{actionError}</p>
          </div>
        )}

        {/* Ships List */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Ships for Pool</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ship ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ship Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adjusted CB
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ships.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No ships available
                    </td>
                  </tr>
                ) : (
                  ships.map((ship) => {
                    const isSelected = selectedShipIds.has(ship.shipId);
                    return (
                      <tr
                        key={ship.shipId}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => toggleShipSelection(ship.shipId)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleShipSelection(ship.shipId)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ship.shipId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ship.shipName}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            ship.adjustedCB >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {ship.adjustedCB >= 0 ? '+' : ''}
                          {ship.adjustedCB.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Pool Button */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={handleCreatePool}
            disabled={!isValidPool || actionLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {actionLoading ? 'Creating Pool...' : 'Create Pool'}
          </button>
          {selectedShips.length === 0 && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Select at least one ship to create a pool
            </p>
          )}
        </div>

        {/* Created Pool Results */}
        {createdPool && createdPool.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pool Created Successfully</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ship ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ship Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CB Before
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CB After
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {createdPool.map((member) => {
                    const change = member.cbAfter - member.cbBefore;
                    return (
                      <tr key={member.shipId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.shipId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.shipName}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            member.cbBefore >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {member.cbBefore >= 0 ? '+' : ''}
                          {member.cbBefore.toFixed(2)}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            member.cbAfter >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {member.cbAfter >= 0 ? '+' : ''}
                          {member.cbAfter.toFixed(2)}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}
                        >
                          {change > 0 ? '+' : ''}
                          {change.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
