"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
class ComplianceService {
    constructor(complianceRepo, bankingRepo) {
        this.complianceRepo = complianceRepo;
        this.bankingRepo = bankingRepo;
    }
    // Returns existing snapshot or 404-like signal by returning null
    async getOrCreateSnapshot(shipId, year) {
        const existing = await this.complianceRepo.findByShipYear(shipId, year);
        if (existing)
            return existing;
        // No way to compute without energy; return null so API can signal 404/BadRequest
        return null;
    }
    async getAdjusted(shipId, year) {
        const snapshot = await this.complianceRepo.findByShipYear(shipId, year);
        if (!snapshot)
            return null;
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
exports.ComplianceService = ComplianceService;
