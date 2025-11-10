# ⚓ FuelEU Maritime — Full Stack Developer Assignment

A minimal yet structured implementation of the **Fuel EU Maritime compliance platform**, built using **React + TypeScript + TailwindCSS** (frontend) and **Node.js + TypeScript + PostgreSQL** (backend), following **Hexagonal Architecture (Ports & Adapters)** principles.

This project demonstrates clean separation of concerns, modular design, and responsible use of AI agents for development, testing, and documentation.

---

## 🧩 Project Structure

├── frontend/
│ ├── src/
│ │ ├── core/
│ │ │ ├── domain/
│ │ │ ├── application/
│ │ │ └── ports/
│ │ ├── adapters/
│ │ │ ├── ui/ # React components, hooks
│ │ │ └── infrastructure/ # API clients (fetch, axios, etc.)
│ │ └── shared/ # constants, utils
│ ├── public/
│ └── package.json
│
├── backend/
│ ├── src/
│ │ ├── core/
│ │ │ ├── domain/ # Entities (Route, Compliance, Pool)
│ │ │ ├── application/ # Use-cases (ComputeCB, CreatePool, etc.)
│ │ │ └── ports/ # Interfaces for persistence & services
│ │ ├── adapters/
│ │ │ ├── inbound/http/ # Express controllers
│ │ │ └── outbound/postgres/ # Prisma/Postgres repositories
│ │ ├── infrastructure/
│ │ │ ├── db/ # Prisma schema + seed data
│ │ │ └── server/ # Express app bootstrap
│ │ └── shared/
│ ├── prisma/
│ └── package.json
│
├── AGENT_WORKFLOW.md
├── REFLECTION.md
└── README.md


---

## 🌐 Overview

The **FuelEU Maritime compliance dashboard** visualizes and manages vessel routes, compliance balance, banking, and pooling mechanisms according to **EU Regulation 2023/1805**.

It includes:

- 📊 **Routes Dashboard** — Display and filter voyage emissions data.
- ⚖️ **Compare Tab** — Analyze baseline vs. comparison GHG intensity.
- 💰 **Banking Module** — Manage surplus and deficit CB across years.
- 🤝 **Pooling Module** — Form CB-sharing pools among compliant ships.

---

## 🧠 Architecture Summary

This project follows **Hexagonal Architecture (Ports & Adapters)**:

- **Core (Domain + Application):**
  - Pure business logic with no dependency on frameworks.
  - Entities: `Route`, `ComplianceBalance`, `Pool`.
  - Use cases: `ComputeCB`, `CompareRoutes`, `BankSurplus`, `ApplyBanked`, `CreatePool`.

- **Ports:**
  - Define interfaces for input/output boundaries (e.g., repository, HTTP, DB).

- **Adapters:**
  - **Inbound**: React components (frontend), Express controllers (backend).
  - **Outbound**: API client (frontend), Prisma/Postgres repository (backend).

- **Infrastructure:**
  - Handles DB, HTTP server, configuration, and startup logic.

---

## ⚙️ Backend — API Endpoints

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/routes` | GET | Fetch all routes |
| `/routes/:id/baseline` | POST | Set a route as baseline |
| `/routes/comparison` | GET | Compare baseline vs. others |
| `/compliance/cb` | GET | Compute Compliance Balance |
| `/compliance/adjusted-cb` | GET | Return CB after banking/pooling |
| `/banking/records` | GET | Get all banked records |
| `/banking/bank` | POST | Bank positive CB |
| `/banking/apply` | POST | Apply banked surplus |
| `/pools` | POST | Create CB pool among ships |

## 💻 Frontend — Tabs & Features

| Tab | Description |
|-----|--------------|
| **Routes** | Displays routes data and sets baseline |
| **Compare** | Shows baseline vs. others with GHG difference and compliance |
| **Banking** | Displays and applies banked CB records |
| **Pooling** | Manages shared CB pools between ships |

### 🖼️ UI Tech Stack
- React 18 + TypeScript
- TailwindCSS

## Frontend
to run the frontend go to the frontend folder run
npm i
npm run dev to see the front end

## Backend 
as for the backend I tried but could not make it in time as I have defined all the routes but there were some complications with prisma I could not resolve in the given timeframe but the routes are defined as per the guidlines and front end works on test seed data that was provided with all the necessary componenets