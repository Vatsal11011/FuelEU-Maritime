"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteService = void 0;
class RouteService {
    constructor(repo) {
        this.repo = repo;
    }
    async listRoutes() {
        return this.repo.findAll();
    }
    async setBaseline(id) {
        return this.repo.setBaselineById(id);
    }
    async getBaselineVsOthers() {
        const [baseline, all] = await Promise.all([this.repo.getBaseline(), this.repo.findAll()]);
        if (!baseline)
            return [];
        const baselineGhg = Number(baseline.ghgIntensity);
        return all
            .filter(r => r.id !== baseline.id)
            .map((r) => {
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
exports.RouteService = RouteService;
