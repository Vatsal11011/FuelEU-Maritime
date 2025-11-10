import dotenv from "dotenv";
dotenv.config();

import { prisma } from "./prisma";

async function main() {
	// Clear existing data (order matters due to relations)
	await prisma.poolMember.deleteMany();
	await prisma.pool.deleteMany();
	await prisma.bankEntry.deleteMany();
	await prisma.shipCompliance.deleteMany();
	// Clear existing routes (safe for dev-only seeding)
	await prisma.route.deleteMany();

	const TARGET_2025 = 89.3368; // gCO2e/MJ
	const MJ_PER_TONNE = 41000; // MJ/t

	// Provided dataset (shipId == routeId for simplicity)
	const dataset = [
		{ routeId: "R001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumptionT: 5000, distanceKm: 12000, totalEmissionsT: 4500, isBaseline: false },
		{ routeId: "R002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumptionT: 4800, distanceKm: 11500, totalEmissionsT: 4200, isBaseline: false },
		{ routeId: "R003", vesselType: "Tanker", fuelType: "MGO", year: 2024, ghgIntensity: 93.5, fuelConsumptionT: 5100, distanceKm: 12500, totalEmissionsT: 4700, isBaseline: false },
		{ routeId: "R004", vesselType: "RoRo", fuelType: "HFO", year: 2025, ghgIntensity: 89.2, fuelConsumptionT: 4900, distanceKm: 11800, totalEmissionsT: 4300, isBaseline: true },
		{ routeId: "R005", vesselType: "Container", fuelType: "LNG", year: 2025, ghgIntensity: 90.5, fuelConsumptionT: 4950, distanceKm: 11900, totalEmissionsT: 4400, isBaseline: false },
	];

	// Seed routes table (schema holds core fields only)
	await prisma.route.createMany({
		data: dataset.map(d => ({
			routeId: d.routeId,
			year: d.year,
			ghgIntensity: d.ghgIntensity.toFixed(6),
			isBaseline: d.isBaseline,
		})),
	});

	// Compute and seed ship_compliance and bank_entries
	const shipCompliance = [];
	const bankEntries = [];
	for (const d of dataset) {
		// Energy (MJ) ≈ fuelConsumption × 41 000 MJ/t
		const energyMj = d.fuelConsumptionT * MJ_PER_TONNE;
		// Compliance Balance (gCO2e) = (Target − Actual) × Energy in scope
		// Units: intensity is gCO2e/MJ, energy is MJ → result in gCO2e
		// Store in gCO2e as Decimal with 6 dp
		const cbGco2e = (TARGET_2025 - d.ghgIntensity) * energyMj;
		shipCompliance.push({
			shipId: d.routeId,
			year: d.year,
			cbGco2eq: cbGco2e.toFixed(6),
		});
		// Bank only surplus (positive CB)
		if (cbGco2e > 0) {
			bankEntries.push({
				shipId: d.routeId,
				year: d.year,
				amountGco2eq: cbGco2e.toFixed(6),
			});
		}
	}

	await prisma.shipCompliance.createMany({ data: shipCompliance });
	if (bankEntries.length > 0) {
		await prisma.bankEntry.createMany({ data: bankEntries });
	}

	// Create a 2025 pool and add 2025 ships as members
	const pool2025 = await prisma.pool.create({
		data: {
			year: 2025,
		},
	});

	const members2025 = dataset
		.filter(d => d.year === 2025)
		.map(d => {
			const energyMj = d.fuelConsumptionT * MJ_PER_TONNE;
			const cbGco2e = (TARGET_2025 - d.ghgIntensity) * energyMj;
			return {
				poolId: pool2025.id,
				shipId: d.routeId,
				cbBefore: cbGco2e.toFixed(6),
				cbAfter: cbGco2e.toFixed(6), // no reallocation yet
			};
		});
	if (members2025.length > 0) {
		await prisma.poolMember.createMany({ data: members2025 });
	}

	console.log("Seed complete:");
	console.log("- routes:", dataset.length);
	console.log("- ship_compliance:", shipCompliance.length);
	console.log("- bank_entries (surpluses only):", bankEntries.length);
	console.log("- pools: 1 (2025)");
	console.log("- pool_members (2025):", members2025.length);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});


