import { Router } from "express";
import { BankingService } from "../../../core/application/bankingService";
import { BankingRepositoryPrisma } from "../../outbound/postgres/bankingRepositoryPrisma";

const bankingRepo = new BankingRepositoryPrisma();
const service = new BankingService(bankingRepo);

export const bankingRouter = Router();

// GET /banking/records?shipId&year
bankingRouter.get("/records", async (req, res) => {
	const shipId = String(req.query.shipId || "");
	const year = Number(req.query.year || NaN);
	if (!shipId || Number.isNaN(year)) {
		return res.status(400).json({ error: "Query params shipId and year are required" });
	}
	const records = await service.getRecords(shipId, year);
	const available = await bankingRepo.sumNetForShipYear(shipId, year);
	return res.json({ data: { records, availableGco2eq: available } });
});

// POST /banking/bank
bankingRouter.post("/bank", async (req, res) => {
	const { shipId, year, amountGco2eq } = req.body ?? {};
	if (!shipId || typeof year !== "number" || typeof amountGco2eq !== "number") {
		return res.status(400).json({ error: "shipId, year (number), amountGco2eq (number) are required" });
	}
	try {
		const record = await service.bank(String(shipId), year, amountGco2eq);
		return res.status(201).json({ data: record });
	} catch (e: any) {
		return res.status(400).json({ error: e.message ?? "Failed to bank amount" });
	}
});

// POST /banking/apply
bankingRouter.post("/apply", async (req, res) => {
	const { shipId, year, amountGco2eq } = req.body ?? {};
	if (!shipId || typeof year !== "number" || typeof amountGco2eq !== "number") {
		return res.status(400).json({ error: "shipId, year (number), amountGco2eq (number) are required" });
	}
	try {
		const record = await service.apply(String(shipId), year, amountGco2eq);
		return res.status(201).json({ data: record });
	} catch (e: any) {
		return res.status(400).json({ error: e.message ?? "Failed to apply banked amount" });
	}
});


