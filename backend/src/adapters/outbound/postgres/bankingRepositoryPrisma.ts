import { prisma } from "../../../infrastructure/db/prisma";
import { BankingRepositoryPort, BankingRecord } from "../../../core/ports/bankingRepositoryPort";

// Define the type Prisma returns for bankEntry if not already generated
// (optional but helps IntelliSense if Prisma types are missing)
type BankEntryRow = {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number | string;
  createdAt?: Date;
};

export class BankingRepositoryPrisma implements BankingRepositoryPort {
  async listByShipYear(shipId: string, year: number): Promise<BankingRecord[]> {
    const rows = await prisma.bankEntry.findMany({ where: { shipId, year }, orderBy: { id: "asc" } });

    // ✅ give type to `r`
    return rows.map((r: BankEntryRow) => ({
      id: r.id,
      shipId: r.shipId,
      year: r.year,
      amountGco2eq: r.amountGco2eq.toString(),
      createdAt: undefined,
    }));
  }

  async createEntry(shipId: string, year: number, amountGco2eq: string): Promise<BankingRecord> {
    const r = await prisma.bankEntry.create({ data: { shipId, year, amountGco2eq } });
    return { id: r.id, shipId: r.shipId, year: r.year, amountGco2eq: r.amountGco2eq.toString(), createdAt: undefined };
  }

  async sumNetForShipYear(shipId: string, year: number): Promise<string> {
    const rows = await prisma.bankEntry.findMany({ where: { shipId, year } });

    // ✅ give types to `acc` and `r`
    const sum = rows.reduce((acc: number, r: BankEntryRow) => acc + Number(r.amountGco2eq), 0);

    return sum.toFixed(6);
  }
}
