"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesRouter = void 0;
const express_1 = require("express");
const routeService_1 = require("../../../core/application/routeService");
const routeRepositoryPrisma_1 = require("../../outbound/postgres/routeRepositoryPrisma");
const repo = new routeRepositoryPrisma_1.RouteRepositoryPrisma();
const service = new routeService_1.RouteService(repo);
exports.routesRouter = (0, express_1.Router)();
// GET /routes -> all routes
exports.routesRouter.get("/", async (_req, res) => {
    const routes = await service.listRoutes();
    res.json({ data: routes });
});
// POST /routes/:id/baseline -> set baseline
exports.routesRouter.post("/:id/baseline", async (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ error: "Missing id" });
    await service.setBaseline(id);
    res.status(204).send();
});
// GET /routes/comparison -> baseline vs others
exports.routesRouter.get("/comparison", async (_req, res) => {
    const comparison = await service.getBaselineVsOthers();
    res.json({ data: comparison });
});
