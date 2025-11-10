import { RouteEntity, RouteComparison } from "../domain/route";
import { RouteRepositoryPort } from "../ports/routeRepositoryPort";

export class RouteService {
	private readonly repo: RouteRepositoryPort;
	constructor(repo: RouteRepositoryPort) {
		this.repo = repo;
	}

	async listRoutes(): Promise<RouteEntity[]> {
		return this.repo.findAll();
	}

	async setBaseline(id: string): Promise<void> {
		return this.repo.setBaselineById(id);
	}

	async getBaselineVsOthers(): Promise<RouteComparison[]> {
		const [baseline, all] = await Promise.all([this.repo.getBaseline(), this.repo.findAll()]);
		if (!baseline) return [];
		const baselineGhg = Number(baseline.ghgIntensity);
		return all
			.filter(r => r.id !== baseline.id)
			.map<RouteComparison>((r) => {
				const otherGhg = Number(r.ghgIntensity);
				const percentDiff = baselineGhg === 0 ? 0 : ((otherGhg - baselineGhg) / baselineGhg) * 100;
				const compliant = otherGhg <= baselineGhg;
				return {
					id: r.id,
					routeId: r.routeId,
					year: r.year,
					baselineGhg,
					otherGhg,
					percentDiff,
					compliant,
				};
			});
	}
}


