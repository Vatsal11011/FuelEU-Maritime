"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingService = void 0;
class BankingService {
    constructor(bankingRepo) {
        this.bankingRepo = bankingRepo;
    }
    async getRecords(shipId, year) {
        return this.bankingRepo.listByShipYear(shipId, year);
    }
    async bank(shipId, year, amountGco2eq) {
        if (!(amountGco2eq > 0)) {
            throw new Error("Amount must be positive");
        }
        return this.bankingRepo.createEntry(shipId, year, amountGco2eq.toFixed(6));
    }
    async apply(shipId, year, amountGco2eq) {
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
exports.BankingService = BankingService;
