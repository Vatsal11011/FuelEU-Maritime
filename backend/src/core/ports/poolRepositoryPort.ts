import { PoolMemberResult } from "../domain/pool";

export interface PoolRepositoryPort {
	createPool(year: number): Promise<{ id: string }>;
	createMembers(poolId: string, members: PoolMemberResult[]): Promise<void>;
}


