export interface ComplianceSnapshot {
	id: string;
	shipId: string;
	year: number;
	cbGco2eq: string; // Decimal as string
}

export interface AdjustedCompliance {
	shipId: string;
	year: number;
	cbGco2eq: string; // original
	adjustedGco2eq: string; // after bank applications
	bankedAppliedGco2eq: string; // total applied
}


