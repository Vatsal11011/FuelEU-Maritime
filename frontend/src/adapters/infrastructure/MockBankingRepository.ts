import type { ComplianceBalance } from '../../core/domain/Banking';
import type { BankRequest } from '../../core/domain/Banking';
import type { ApplyRequest } from '../../core/domain/Banking';
import type { IBankingRepository } from '../../core/ports/outbound/IBankingRepository';

export class MockBankingRepository implements IBankingRepository {
  private mockData: Map<number, ComplianceBalance> = new Map([
    [
      2024,
      {
        year: 2024,
        cb_before: 150.5,
        applied: 0,
        cb_after: 150.5,
        bankedSurplus: 0,
      },
    ],
    [
      2025,
      {
        year: 2025,
        cb_before: 200.0,
        applied: 0,
        cb_after: 200.0,
        bankedSurplus: 50.0,
      },
    ],
  ]);

  async getComplianceBalance(year: number): Promise<ComplianceBalance> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const data = this.mockData.get(year);
    if (!data) {
      // Return default for new years
      return {
        year,
        cb_before: 0,
        applied: 0,
        cb_after: 0,
        bankedSurplus: 0,
      };
    }
    
    return { ...data };
  }

  async bankSurplus(request: BankRequest): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // In a real implementation, this would call the API
    // For mock, we just log it
    console.log(`Banking surplus: ${request.amount}`);
  }

  async applyBankedSurplus(request: ApplyRequest): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // In a real implementation, this would call the API
    // For mock, we just log it
    console.log(`Applying banked surplus: ${request.amount} to year ${request.year}`);
  }
}

