import { BankingRepositoryPort } from "../ports/bankingRepositoryPort";

export class BankingService {
	constructor(private readonly bankingRepo: BankingRepositoryPort) {}

	async getRecords(shipId: string, year: number) {
		return this.bankingRepo.listByShipYear(shipId, year);
	}

	async bank(shipId: string, year: number, amountGco2eq: number) {
		if (!(amountGco2eq > 0)) {
			throw new Error("Amount must be positive");
		}
		return this.bankingRepo.createEntry(shipId, year, amountGco2eq.toFixed(6));
	}

	async apply(shipId: string, year: number, amountGco2eq: number) {
		if (!(amountGco2eq > 0)) {
			throw new Error("Amount must be positive");
		}
		const net = Number(await this.bankingRepo.sumNetForShipYear(shipId, year));
		if (amountGco2eq > net) {
			throw new Error("Amount exceeds available banked balance");
		}
		// Applying creates a negative entry to deduct from available
		return this.bankingRepo.createEntry(shipId, year, (-amountGco2eq).toFixed(6));
	}
}


