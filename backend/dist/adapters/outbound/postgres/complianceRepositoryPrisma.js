"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceRepositoryPrisma = void 0;
const prisma_1 = require("../../../infrastructure/db/prisma");
class ComplianceRepositoryPrisma {
    async findByShipYear(shipId, year) {
        const r = await prisma_1.prisma.shipCompliance.findFirst({ where: { shipId, year } });
        if (!r)
            return null;
        return { id: r.id, shipId: r.shipId, year: r.year, cbGco2eq: r.cbGco2eq.toString() };
    }
    async createSnapshot(shipId, year, cbGco2eq) {
        const r = await prisma_1.prisma.shipCompliance.create({
            data: { shipId, year, cbGco2eq },
        });
        return { id: r.id, shipId: r.shipId, year: r.year, cbGco2eq: r.cbGco2eq.toString() };
    }
}
exports.ComplianceRepositoryPrisma = ComplianceRepositoryPrisma;
