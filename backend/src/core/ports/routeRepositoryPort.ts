import { RouteEntity } from "../domain/route";

export interface RouteRepositoryPort {
	findAll(): Promise<RouteEntity[]>;
	getBaseline(): Promise<RouteEntity | null>;
	setBaselineById(id: string): Promise<void>;
}


