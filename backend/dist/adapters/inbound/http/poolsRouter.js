"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolsRouter = void 0;
const express_1 = require("express");
const poolService_1 = require("../../../core/application/poolService");
const poolRepositoryPrisma_1 = require("../../outbound/postgres/poolRepositoryPrisma");
const poolRepo = new poolRepositoryPrisma_1.PoolRepositoryPrisma();
const service = new poolService_1.PoolService(poolRepo);
exports.poolsRouter = (0, express_1.Router)();
// POST /pools
// Body: { year: number, members: [{ shipId: string, cbBefore: number }] }
exports.poolsRouter.post("/", async (req, res) => {
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
    }
    catch (e) {
        return res.status(400).json({ error: e.message ?? "Failed to create pool" });
    }
});
