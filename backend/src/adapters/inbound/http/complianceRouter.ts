import { Router } from "express";
import { ComplianceService } from "../../../core/application/complianceService";
import { ComplianceRepositoryPrisma } from "../../outbound/postgres/complianceRepositoryPrisma";
import { BankingRepositoryPrisma } from "../../outbound/postgres/bankingRepositoryPrisma";

const complianceRepo = new ComplianceRepositoryPrisma();
const bankingRepo = new BankingRepositoryPrisma();
const service = new ComplianceService(complianceRepo, bankingRepo);

export const complianceRouter = Router();

// GET /compliance/cb?shipId&year -> Compute and store CB snapshot (uses existing snapshot if present)
complianceRouter.get("/cb", async (req, res) => {
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
complianceRouter.get("/adjusted-cb", async (req, res) => {
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


