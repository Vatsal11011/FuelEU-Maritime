export interface RouteEntity {
	id: string;
	routeId: string;
	year: number;
	ghgIntensity: string; // Decimal as string
	isBaseline: boolean;
}

export interface RouteComparison {
	id: string;
	routeId: string;
	year: number;
	baselineGhg: number;
	otherGhg: number;
	percentDiff: number; // ((other - baseline) / baseline) * 100
	compliant: boolean; // other <= baseline
}


