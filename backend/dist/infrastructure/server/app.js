"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const healthRouter_1 = require("../../adapters/inbound/http/healthRouter");
const routesRouter_1 = require("../../adapters/inbound/http/routesRouter");
const complianceRouter_1 = require("../../adapters/inbound/http/complianceRouter");
const bankingRouter_1 = require("../../adapters/inbound/http/bankingRouter");
const poolsRouter_1 = require("../../adapters/inbound/http/poolsRouter");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use("/health", healthRouter_1.healthRouter);
exports.app.use("/routes", routesRouter_1.routesRouter);
exports.app.use("/compliance", complianceRouter_1.complianceRouter);
exports.app.use("/banking", bankingRouter_1.bankingRouter);
exports.app.use("/pools", poolsRouter_1.poolsRouter);
exports.app.get("/", (_req, res) => {
    res.json({ name: "Fuel EU Dashboard API", status: "ok" });
});
