"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complianceRouter = void 0;
const express_1 = require("express");
const complianceService_1 = require("../../../core/application/complianceService");
const complianceRepositoryPrisma_1 = require("../../outbound/postgres/complianceRepositoryPrisma");
const bankingRepositoryPrisma_1 = require("../../outbound/postgres/bankingRepositoryPrisma");
const complianceRepo = new complianceRepositoryPrisma_1.ComplianceRepositoryPrisma();
const bankingRepo = new bankingRepositoryPrisma_1.BankingRepositoryPrisma();
const service = new complianceService_1.ComplianceService(complianceRepo, bankingRepo);
exports.complianceRouter = (0, express_1.Router)();
// GET /compliance/cb?shipId&year -> Compute and store CB snapshot (uses existing snapshot if present)
exports.complianceRouter.get("/cb", async (req, res) => {
    const shipId = String(req.query.shipId || "");
    const year = Number(req.query.year || NaN);
    if (!shipId || Number.isNaN(year)) {
        return res.status(400).json({ error: "Query params shipId and year are required" });
    }
    const snapshot = await service.getOrCreateSnapshot(shipId, year);
    if (!snapshot) {
        return res.status(404).json({ error: "No compliance snapshot available to compute for the given ship/year" });
    }
    return res.json({ data: snapshot });
});
// GET /compliance/adjusted-cb?shipId&year -> Return CB after bank applications
exports.complianceRouter.get("/adjusted-cb", async (req, res) => {
    const shipId = String(req.query.shipId || "");
    const year = Number(req.query.year || NaN);
    if (!shipId || Number.isNaN(year)) {
        return res.status(400).json({ error: "Query params shipId and year are required" });
    }
    const adjusted = await service.getAdjusted(shipId, year);
    if (!adjusted) {
        return res.status(404).json({ error: "No compliance snapshot found for the given ship/year" });
    }
    return res.json({ data: adjusted });
});
