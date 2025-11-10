import { ComplianceSnapshot } from "../domain/compliance";

export interface ComplianceRepositoryPort {
	findByShipYear(shipId: string, year: number): Promise<ComplianceSnapshot | null>;
	createSnapshot(shipId: string, year: number, cbGco2eq: string): Promise<ComplianceSnapshot>;
}


