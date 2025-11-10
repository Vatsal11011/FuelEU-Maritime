import { prisma } from "../../../infrastructure/db/prisma";
import { PoolRepositoryPort } from "../../../core/ports/poolRepositoryPort";
import { PoolMemberResult } from "../../../core/domain/pool";

export class PoolRepositoryPrisma implements PoolRepositoryPort {
	async createPool(year: number): Promise<{ id: string }> {
		const p = await prisma.pool.create({ data: { year } });
		return { id: p.id };
	}
	async createMembers(poolId: string, members: PoolMemberResult[]): Promise<void> {
		await prisma.poolMember.createMany({
			data: members.map(m => ({
				poolId,
				shipId: m.shipId,
				cbBefore: m.cbBefore.toFixed(6),
				cbAfter: m.cbAfter.toFixed(6),
			})),
		});
	}
}


