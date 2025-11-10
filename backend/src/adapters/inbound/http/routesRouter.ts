import { Router } from "express";
import { RouteService } from "../../../core/application/routeService";
import { RouteRepositoryPrisma } from "../../outbound/postgres/routeRepositoryPrisma";

const repo = new RouteRepositoryPrisma();
const service = new RouteService(repo);

export const routesRouter = Router();

// GET /routes -> all routes
routesRouter.get("/", async (_req, res) => {
	const routes = await service.listRoutes();
	res.json({ data: routes });
});

// POST /routes/:id/baseline -> set baseline
routesRouter.post("/:id/baseline", async (req, res) => {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: "Missing id" });
	await service.setBaseline(id);
	res.status(204).send();
});

// GET /routes/comparison -> baseline vs others
routesRouter.get("/comparison", async (_req, res) => {
	const comparison = await service.getBaselineVsOthers();
	res.json({ data: comparison });
});


