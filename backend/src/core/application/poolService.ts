import { PoolMemberInput, PoolMemberResult } from "../domain/pool";
import { PoolRepositoryPort } from "../ports/poolRepositoryPort";

export class PoolService {
	constructor(private readonly poolRepo: PoolRepositoryPort) {}

	private greedyAllocate(inputs: PoolMemberInput[]): PoolMemberResult[] {
		const total = inputs.reduce((acc, m) => acc + m.cbBefore, 0);
		if (total < 0) {
			throw new Error("Total CB sum must be >= 0");
		}

		const surpluses = inputs
			.filter(m => m.cbBefore > 0)
			.map(m => ({ ...m, remaining: m.cbBefore }))
			.sort((a, b) => b.remaining - a.remaining);
		const deficits = inputs
			.filter(m => m.cbBefore < 0)
			.map(m => ({ ...m, needed: -m.cbBefore }))
			.sort((a, b) => b.needed - a.needed); // largest deficit first
		const zeros = inputs.filter(m => m.cbBefore === 0);

		const resultMap = new Map<string, number>();
		for (const m of inputs) resultMap.set(m.shipId, m.cbBefore);

		for (const d of deficits) {
			let need = d.needed;
			for (const s of surpluses) {
				if (need <= 0) break;
				if (s.remaining <= 0) continue;
				const transfer = Math.min(s.remaining, need);
				s.remaining -= transfer;
				need -= transfer;
				resultMap.set(s.shipId, (resultMap.get(s.shipId) || 0) - transfer);
				resultMap.set(d.shipId, (resultMap.get(d.shipId) || 0) + transfer);
			}
		}

		// Constraints:
		// - Deficit ship cannot exit worse (cbAfter >= cbBefore)
		// - Surplus ship cannot exit negative (cbAfter >= 0)
		for (const m of inputs) {
			const after = resultMap.get(m.shipId) || 0;
			if (m.cbBefore < 0 && after < m.cbBefore) {
				throw new Error("Deficit ship cannot exit worse than before");
			}
			if (m.cbBefore > 0 && after < 0) {
				throw new Error("Surplus ship cannot exit negative after pooling");
			}
		}

		return inputs.map<PoolMemberResult>(m => ({
			shipId: m.shipId,
			cbBefore: m.cbBefore,
			cbAfter: Number((resultMap.get(m.shipId) || 0).toFixed(6)),
		}));
	}

	async createPool(year: number, members: PoolMemberInput[]) {
		const allocation = this.greedyAllocate(members);
		const pool = await this.poolRepo.createPool(year);
		await this.poolRepo.createMembers(pool.id, allocation);
		return { poolId: pool.id, members: allocation };
	}
}


