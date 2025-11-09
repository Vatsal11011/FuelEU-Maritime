import React, { useState, useEffect, useMemo } from 'react';
import type { RouteComparison } from '../../../core/domain/RouteComparison';
import { GetComparisonsUseCase } from '../../../core/application/GetComparisonsUseCase';
import { MockComparisonRepository } from '../../../adapters/infrastructure/MockComparisonRepository';
// import { ComparisonRepository } from '../../../adapters/infrastructure/ComparisonRepository';
// import { ApiClient } from '../../../adapters/infrastructure/ApiClient';

const TARGET_GHG_INTENSITY = 89.3368; // 2% below 91.16 gCO₂e/MJ

export const CompareTab: React.FC = () => {
  const [comparisons, setComparisons] = useState<RouteComparison[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize use case with mock repository
  const { getComparisonsUseCase } = useMemo(() => {
    const comparisonRepository = new MockComparisonRepository();
    // For real API: const apiClient = new ApiClient('http://your-api-url');
    // const comparisonRepository = new ComparisonRepository(apiClient);
    return {
      getComparisonsUseCase: new GetComparisonsUseCase(comparisonRepository),
    };
  }, []);

  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getComparisonsUseCase.execute();
        setComparisons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch comparisons');
      } finally {
        setLoading(false);
      }
    };

    fetchComparisons();
  }, [getComparisonsUseCase]);

  // Calculate chart dimensions
  const maxIntensity = Math.max(
    ...comparisons.flatMap((c) => [c.baseline.ghgIntensity, c.comparison.ghgIntensity]),
    TARGET_GHG_INTENSITY
  );
  const minIntensity = Math.min(
    ...comparisons.flatMap((c) => [c.baseline.ghgIntensity, c.comparison.ghgIntensity]),
    TARGET_GHG_INTENSITY
  );
  const chartHeight = 300;
  const chartWidth = 800;
  const barWidth = 30;
  const spacing = 20;

  const getBarHeight = (value: number) => {
    const range = maxIntensity - minIntensity;
    return ((value - minIntensity) / range) * chartHeight;
  };

  const getBarX = (index: number, offset: number) => {
    return index * (barWidth * 2 + spacing * 2) + offset;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Compare</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Loading comparison data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Compare</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Comparisons</h3>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Compare</h2>
        <p className="text-sm text-gray-600 mb-6">
          Target GHG Intensity: <strong>{TARGET_GHG_INTENSITY} gCO₂e/MJ</strong> (2% below 91.16)
        </p>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">GHG Intensity Comparison</h3>
          <div className="overflow-x-auto">
            <svg width={chartWidth} height={chartHeight + 60} className="mx-auto">
              {/* Target line */}
              <line
                x1={0}
                y1={chartHeight - getBarHeight(TARGET_GHG_INTENSITY) + 30}
                x2={chartWidth}
                y2={chartHeight - getBarHeight(TARGET_GHG_INTENSITY) + 30}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text
                x={chartWidth - 150}
                y={chartHeight - getBarHeight(TARGET_GHG_INTENSITY) + 25}
                fill="#ef4444"
                fontSize="12"
                fontWeight="bold"
              >
                Target: {TARGET_GHG_INTENSITY}
              </text>

              {/* Bars */}
              {comparisons.map((comp, index) => {
                const baselineX = getBarX(index, spacing);
                const comparisonX = getBarX(index, spacing + barWidth + spacing);
                const baselineHeight = getBarHeight(comp.baseline.ghgIntensity);
                const comparisonHeight = getBarHeight(comp.comparison.ghgIntensity);

                return (
                  <g key={comp.routeId}>
                    {/* Baseline bar */}
                    <rect
                      x={baselineX}
                      y={chartHeight - baselineHeight + 30}
                      width={barWidth}
                      height={baselineHeight}
                      fill="#3b82f6"
                      opacity={0.7}
                    />
                    <text
                      x={baselineX + barWidth / 2}
                      y={chartHeight - baselineHeight + 25}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#1e40af"
                    >
                      {comp.baseline.ghgIntensity.toFixed(1)}
                    </text>

                    {/* Comparison bar */}
                    <rect
                      x={comparisonX}
                      y={chartHeight - comparisonHeight + 30}
                      width={barWidth}
                      height={comparisonHeight}
                      fill={comp.compliant ? '#10b981' : '#f59e0b'}
                    />
                    <text
                      x={comparisonX + barWidth / 2}
                      y={chartHeight - comparisonHeight + 25}
                      textAnchor="middle"
                      fontSize="10"
                      fill={comp.compliant ? '#047857' : '#92400e'}
                    >
                      {comp.comparison.ghgIntensity.toFixed(1)}
                    </text>

                    {/* Route ID label */}
                    <text
                      x={baselineX + barWidth + spacing / 2}
                      y={chartHeight + 50}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="bold"
                    >
                      {comp.routeId}
                    </text>
                  </g>
                );
              })}

              {/* Y-axis labels */}
              <text x={-10} y={chartHeight + 30} fontSize="12" fill="#6b7280">
                {minIntensity.toFixed(1)}
              </text>
              <text x={-10} y={35} fontSize="12" fill="#6b7280">
                {maxIntensity.toFixed(1)}
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 opacity-70"></div>
              <span className="text-sm text-gray-600">Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500"></div>
              <span className="text-sm text-gray-600">Comparison (Compliant)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500"></div>
              <span className="text-sm text-gray-600">Comparison (Non-Compliant)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 border-t-2 border-dashed border-red-500"></div>
              <span className="text-sm text-gray-600">Target</span>
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
                    Baseline GHG Intensity (gCO₂e/MJ)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comparison GHG Intensity (gCO₂e/MJ)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Difference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compliant
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No comparison data available
                    </td>
                  </tr>
                ) : (
                  comparisons.map((comp) => (
                    <tr key={comp.routeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {comp.routeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {comp.baseline.ghgIntensity.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {comp.comparison.ghgIntensity.toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          comp.percentDifference < 0
                            ? 'text-green-600'
                            : comp.percentDifference > 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {comp.percentDifference >= 0 ? '+' : ''}
                        {comp.percentDifference.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {comp.compliant ? (
                          <span className="text-green-600 font-semibold">✅ Compliant</span>
                        ) : (
                          <span className="text-red-600 font-semibold">❌ Non-Compliant</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
