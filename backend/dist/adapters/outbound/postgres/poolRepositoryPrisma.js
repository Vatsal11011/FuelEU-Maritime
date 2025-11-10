"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolRepositoryPrisma = void 0;
const prisma_1 = require("../../../infrastructure/db/prisma");
class PoolRepositoryPrisma {
    async createPool(year) {
        const p = await prisma_1.prisma.pool.create({ data: { year } });
        return { id: p.id };
    }
    async createMembers(poolId, members) {
        await prisma_1.prisma.poolMember.createMany({
            data: members.map(m => ({
                poolId,
                shipId: m.shipId,
                cbBefore: m.cbBefore.toFixed(6),
                cbAfter: m.cbAfter.toFixed(6),
            })),
        });
    }
}
exports.PoolRepositoryPrisma = PoolRepositoryPrisma;
