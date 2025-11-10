import { prisma } from "../../../infrastructure/db/prisma";
import { RouteRepositoryPort } from "../../../core/ports/routeRepositoryPort";
import { RouteEntity } from "../../../core/domain/route";

// Optional: define a lightweight type for safety
type RouteRow = {
  id: string;
  routeId: string;
  year: number;
  ghgIntensity: number | string;
  isBaseline: boolean;
};

export class RouteRepositoryPrisma implements RouteRepositoryPort {
  async findAll(): Promise<RouteEntity[]> {
    const rows = await prisma.route.findMany({
      orderBy: [{ year: "asc" }, { routeId: "asc" }],
    });

    // ✅ add explicit type to `r`
    return rows.map((r: RouteRow) => ({
      id: r.id,
      routeId: r.routeId,
      year: r.year,
      ghgIntensity: r.ghgIntensity.toString(),
      isBaseline: r.isBaseline,
    }));
  }

  async getBaseline(): Promise<RouteEntity | null> {
    const r = await prisma.route.findFirst({ where: { isBaseline: true } });
    if (!r) return null;
    return {
      id: r.id,
      routeId: r.routeId,
      year: r.year,
      ghgIntensity: r.ghgIntensity.toString(),
      isBaseline: r.isBaseline,
    };
  }

  async setBaselineById(id: string): Promise<void> {
    // Unset any existing baseline, then set the desired one
    await prisma.$transaction([
      prisma.route.updateMany({ data: { isBaseline: false }, where: { isBaseline: true } }),
      prisma.route.update({ where: { id }, data: { isBaseline: true } }),
    ]);
  }
}
