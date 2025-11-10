import { prisma } from "../../../infrastructure/db/prisma";
import { ComplianceRepositoryPort } from "../../../core/ports/complianceRepositoryPort";
import { ComplianceSnapshot } from "../../../core/domain/compliance";

export class ComplianceRepositoryPrisma implements ComplianceRepositoryPort {
	async findByShipYear(shipId: string, year: number): Promise<ComplianceSnapshot | null> {
		const r = await prisma.shipCompliance.findFirst({ where: { shipId, year } });
		if (!r) return null;
		return { id: r.id, shipId: r.shipId, year: r.year, cbGco2eq: r.cbGco2eq.toString() };
	}

	async createSnapshot(shipId: string, year: number, cbGco2eq: string): Promise<ComplianceSnapshot> {
		const r = await prisma.shipCompliance.create({
			data: { shipId, year, cbGco2eq },
		});
		return { id: r.id, shipId: r.shipId, year: r.year, cbGco2eq: r.cbGco2eq.toString() };
	}
}


