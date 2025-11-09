import React, { useState, useEffect, useMemo } from 'react';
import type { ComplianceBalance } from '../../../core/domain/Banking';
import { GetComplianceBalanceUseCase } from '../../../core/application/GetComplianceBalanceUseCase';
import { BankSurplusUseCase } from '../../../core/application/BankSurplusUseCase';
import { ApplyBankedSurplusUseCase } from '../../../core/application/ApplyBankedSurplusUseCase';
import { MockBankingRepository } from '../../../adapters/infrastructure/MockBankingRepository';
// import { BankingRepository } from '../../../adapters/infrastructure/BankingRepository';
// import { ApiClient } from '../../../adapters/infrastructure/ApiClient';

export const BankingTab: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [complianceBalance, setComplianceBalance] = useState<ComplianceBalance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  
  // Banking form state
  const [bankAmount, setBankAmount] = useState<string>('');
  const [applyAmount, setApplyAmount] = useState<string>('');
  const [applyYear, setApplyYear] = useState<number>(currentYear);

  // Initialize use cases with mock repository
  const { getComplianceBalanceUseCase, bankSurplusUseCase, applyBankedSurplusUseCase } = useMemo(() => {
    const bankingRepository = new MockBankingRepository();
    // For real API: const apiClient = new ApiClient('http://your-api-url');
    // const bankingRepository = new BankingRepository(apiClient);
    return {
      getComplianceBalanceUseCase: new GetComplianceBalanceUseCase(bankingRepository),
      bankSurplusUseCase: new BankSurplusUseCase(bankingRepository),
      applyBankedSurplusUseCase: new ApplyBankedSurplusUseCase(bankingRepository),
    };
  }, []);

  useEffect(() => {
    const fetchComplianceBalance = async () => {
      try {
        setLoading(true);
        setError(null);
        setActionError(null);
        const data = await getComplianceBalanceUseCase.execute(currentYear);
        setComplianceBalance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch compliance balance');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceBalance();
  }, [currentYear, getComplianceBalanceUseCase]);

  const handleBankSurplus = async () => {
    const amount = parseFloat(bankAmount);
    if (isNaN(amount) || amount <= 0) {
      setActionError('Please enter a valid positive amount');
      return;
    }

    if (!complianceBalance || complianceBalance.cb_after <= 0) {
      setActionError('Cannot bank: Compliance Balance must be positive');
      return;
    }

    if (amount > complianceBalance.cb_after) {
      setActionError(`Cannot bank more than available CB (${complianceBalance.cb_after})`);
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);
      await bankSurplusUseCase.execute({ amount });
      setBankAmount('');
      // Refresh compliance balance
      const data = await getComplianceBalanceUseCase.execute(currentYear);
      setComplianceBalance(data);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to bank surplus');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyBankedSurplus = async () => {
    const amount = parseFloat(applyAmount);
    if (isNaN(amount) || amount <= 0) {
      setActionError('Please enter a valid positive amount');
      return;
    }

    if (!complianceBalance || complianceBalance.bankedSurplus <= 0) {
      setActionError('No banked surplus available to apply');
      return;
    }

    if (amount > complianceBalance.bankedSurplus) {
      setActionError(`Cannot apply more than available banked surplus (${complianceBalance.bankedSurplus})`);
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);
      await applyBankedSurplusUseCase.execute({ amount, year: applyYear });
      setApplyAmount('');
      // Refresh compliance balance
      const data = await getComplianceBalanceUseCase.execute(currentYear);
      setComplianceBalance(data);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to apply banked surplus');
    } finally {
      setActionLoading(false);
    }
  };

  const canBank = complianceBalance && complianceBalance.cb_after > 0;
  const canApply = complianceBalance && complianceBalance.bankedSurplus > 0;

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Banking</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Loading compliance balance...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Banking</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Compliance Balance</h3>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Banking (Fuel EU Article 20)</h2>

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

        {/* KPIs */}
        {complianceBalance && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">CB Before</h3>
              <p className={`text-2xl font-bold ${
                complianceBalance.cb_before > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {complianceBalance.cb_before.toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Applied</h3>
              <p className="text-2xl font-bold text-blue-600">
                {complianceBalance.applied.toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">CB After</h3>
              <p className={`text-2xl font-bold ${
                complianceBalance.cb_after > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {complianceBalance.cb_after.toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Banked Surplus</h3>
              <p className="text-2xl font-bold text-purple-600">
                {complianceBalance.bankedSurplus.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Action Error Display */}
        {actionError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{actionError}</p>
          </div>
        )}

        {/* Banking Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Surplus */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Surplus</h3>
            <p className="text-sm text-gray-600 mb-4">
              Bank positive Compliance Balance for future use.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Bank
                </label>
                <input
                  type="number"
                  value={bankAmount}
                  onChange={(e) => setBankAmount(e.target.value)}
                  placeholder="Enter amount"
                  disabled={!canBank || actionLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {complianceBalance && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {complianceBalance.cb_after.toFixed(2)}
                  </p>
                )}
              </div>
              <button
                onClick={handleBankSurplus}
                disabled={!canBank || actionLoading || !bankAmount}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Processing...' : 'Bank Surplus'}
              </button>
              {!canBank && (
                <p className="text-sm text-red-600">
                  Cannot bank: Compliance Balance must be positive
                </p>
              )}
            </div>
          </div>

          {/* Apply Banked Surplus */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Apply Banked Surplus</h3>
            <p className="text-sm text-gray-600 mb-4">
              Apply banked surplus to cover a deficit.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Apply
                </label>
                <input
                  type="number"
                  value={applyAmount}
                  onChange={(e) => setApplyAmount(e.target.value)}
                  placeholder="Enter amount"
                  disabled={!canApply || actionLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {complianceBalance && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {complianceBalance.bankedSurplus.toFixed(2)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apply to Year
                </label>
                <select
                  value={applyYear}
                  onChange={(e) => setApplyYear(parseInt(e.target.value))}
                  disabled={!canApply || actionLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {[2024, 2025, 2026, 2027, 2028].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleApplyBankedSurplus}
                disabled={!canApply || actionLoading || !applyAmount}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Processing...' : 'Apply Banked Surplus'}
              </button>
              {!canApply && (
                <p className="text-sm text-red-600">
                  No banked surplus available to apply
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
