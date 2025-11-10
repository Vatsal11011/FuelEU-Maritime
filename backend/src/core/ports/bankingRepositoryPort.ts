export interface BankingRecord {
	id: string;
	shipId: string;
	year: number;
	amountGco2eq: string;
	createdAt?: string;
}

export interface BankingRepositoryPort {
	listByShipYear(shipId: string, year: number): Promise<BankingRecord[]>;
	createEntry(shipId: string, year: number, amountGco2eq: string): Promise<BankingRecord>;
	sumNetForShipYear(shipId: string, year: number): Promise<string>; // sum of all amounts (+banked, -applied)
}


