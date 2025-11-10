import { Router } from "express";
import { PoolService } from "../../../core/application/poolService";
import { PoolRepositoryPrisma } from "../../outbound/postgres/poolRepositoryPrisma";

const poolRepo = new PoolRepositoryPrisma();
const service = new PoolService(poolRepo);

export const poolsRouter = Router();

// POST /pools
// Body: { year: number, members: [{ shipId: string, cbBefore: number }] }
poolsRouter.post("/", async (req, res) => {
	const { year, members } = req.body ?? {};
	if (typeof year !== "number" || !Array.isArray(members) || members.length === 0) {
		return res.status(400).json({ error: "year (number) and non-empty members[] are required" });
	}
	for (const m of members) {
		if (!m?.shipId || typeof m?.cbBefore !== "number") {
			return res.status(400).json({ error: "members[].shipId and members[].cbBefore (number) are required" });
		}
	}
	try {
		const result = await service.createPool(year, members);
		return res.status(201).json({ data: result });
	} catch (e: any) {
		return res.status(400).json({ error: e.message ?? "Failed to create pool" });
	}
});


