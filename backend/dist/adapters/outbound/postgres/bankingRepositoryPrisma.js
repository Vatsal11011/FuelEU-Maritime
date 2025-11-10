"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingRepositoryPrisma = void 0;
const prisma_1 = require("../../../infrastructure/db/prisma");
class BankingRepositoryPrisma {
    async listByShipYear(shipId, year) {
        const rows = await prisma_1.prisma.bankEntry.findMany({ where: { shipId, year }, orderBy: { id: "asc" } });
        // ✅ give type to `r`
        return rows.map((r) => ({
            id: r.id,
            shipId: r.shipId,
            year: r.year,
            amountGco2eq: r.amountGco2eq.toString(),
            createdAt: undefined,
        }));
    }
    async createEntry(shipId, year, amountGco2eq) {
        const r = await prisma_1.prisma.bankEntry.create({ data: { shipId, year, amountGco2eq } });
        return { id: r.id, shipId: r.shipId, year: r.year, amountGco2eq: r.amountGco2eq.toString(), createdAt: undefined };
    }
    async sumNetForShipYear(shipId, year) {
        const rows = await prisma_1.prisma.bankEntry.findMany({ where: { shipId, year } });
        // ✅ give types to `acc` and `r`
        const sum = rows.reduce((acc, r) => acc + Number(r.amountGco2eq), 0);
        return sum.toFixed(6);
    }
}
exports.BankingRepositoryPrisma = BankingRepositoryPrisma;
