import { AdjustedCompliance, ComplianceSnapshot } from "../domain/compliance";
import { ComplianceRepositoryPort } from "../ports/complianceRepositoryPort";
import { BankingRepositoryPort } from "../ports/bankingRepositoryPort";

export class ComplianceService {
	constructor(
		private readonly complianceRepo: ComplianceRepositoryPort,
		private readonly bankingRepo: BankingRepositoryPort
	) {}

	// Returns existing snapshot or 404-like signal by returning null
	async getOrCreateSnapshot(shipId: string, year: number): Promise<ComplianceSnapshot | null> {
		const existing = await this.complianceRepo.findByShipYear(shipId, year);
		if (existing) return existing;
		// No way to compute without energy; return null so API can signal 404/BadRequest
		return null;
	}

	async getAdjusted(shipId: string, year: number): Promise<AdjustedCompliance | null> {
		const snapshot = await this.complianceRepo.findByShipYear(shipId, year);
		if (!snapshot) return null;

		// FIXED: changed from sumBankedForShipYear → sumNetForShipYear
		const banked = await this.bankingRepo.sumNetForShipYear(shipId, year);

		const cb = Number(snapshot.cbGco2eq);
		const applied = Number(banked);
		const adjusted = cb - applied;

		return {
			shipId,
			year,
			cbGco2eq: snapshot.cbGco2eq,
			adjustedGco2eq: adjusted.toFixed(6),
			bankedAppliedGco2eq: applied.toFixed(6),
		};
	}
}
