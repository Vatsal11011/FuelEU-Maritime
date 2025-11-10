import express from "express";
import { healthRouter } from "../../adapters/inbound/http/healthRouter";
import { routesRouter } from "../../adapters/inbound/http/routesRouter";
import { complianceRouter } from "../../adapters/inbound/http/complianceRouter";
import { bankingRouter } from "../../adapters/inbound/http/bankingRouter";
import { poolsRouter } from "../../adapters/inbound/http/poolsRouter";

export const app = express();

app.use(express.json());

app.use("/health", healthRouter);
app.use("/routes", routesRouter);
app.use("/compliance", complianceRouter);
app.use("/banking", bankingRouter);
app.use("/pools", poolsRouter);

app.get("/", (_req, res) => {
	res.json({ name: "Fuel EU Dashboard API", status: "ok" });
});


