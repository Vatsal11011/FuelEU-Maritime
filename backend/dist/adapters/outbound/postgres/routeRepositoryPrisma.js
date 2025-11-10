"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteRepositoryPrisma = void 0;
const prisma_1 = require("../../../infrastructure/db/prisma");
class RouteRepositoryPrisma {
    async findAll() {
        const rows = await prisma_1.prisma.route.findMany({
            orderBy: [{ year: "asc" }, { routeId: "asc" }],
        });
        // ✅ add explicit type to `r`
        return rows.map((r) => ({
            id: r.id,
            routeId: r.routeId,
            year: r.year,
            ghgIntensity: r.ghgIntensity.toString(),
            isBaseline: r.isBaseline,
        }));
    }
    async getBaseline() {
        const r = await prisma_1.prisma.route.findFirst({ where: { isBaseline: true } });
        if (!r)
            return null;
        return {
            id: r.id,
            routeId: r.routeId,
            year: r.year,
            ghgIntensity: r.ghgIntensity.toString(),
            isBaseline: r.isBaseline,
        };
    }
    async setBaselineById(id) {
        // Unset any existing baseline, then set the desired one
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.route.updateMany({ data: { isBaseline: false }, where: { isBaseline: true } }),
            prisma_1.prisma.route.update({ where: { id }, data: { isBaseline: true } }),
        ]);
    }
}
exports.RouteRepositoryPrisma = RouteRepositoryPrisma;
