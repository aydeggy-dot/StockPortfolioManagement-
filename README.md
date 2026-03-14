# Stock Portfolio Management

A full-stack web application for managing a personal stock portfolio. Track holdings, monitor performance, get price alerts, and view analytics charts.

## Tech Stack

- **Frontend:** React 18 + TypeScript, Vite, TanStack Query v5, Recharts, Tailwind CSS
- **Backend:** Java 21, Spring Boot 3.x, Spring Data JPA
- **Database:** PostgreSQL 15

## Prerequisites

- Docker & Docker Compose (recommended)
- Java 21 (for local backend)
- Node.js 20 (for local frontend)
- PostgreSQL 15+ (for local without Docker)

## Running with Docker (Recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api/stocks
- PostgreSQL: localhost:5432

## Running Locally (Without Docker)

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE portfolio_db;
```

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend starts on port 8080. Configure via environment variables:
- `DB_HOST` (default: localhost)
- `DB_PORT` (default: 5432)
- `DB_NAME` (default: portfolio_db)
- `DB_USERNAME` (default: postgres)
- `DB_PASSWORD` (default: postgres)

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on http://localhost:5173.

Set `VITE_API_BASE_URL` in `frontend/.env` to point to the backend (default: http://localhost:8080/api).

## API Endpoints

| Method | Endpoint                | Description                          |
|--------|-------------------------|--------------------------------------|
| GET    | /api/stocks             | Get all stocks                       |
| GET    | /api/stocks/{id}        | Get single stock                     |
| POST   | /api/stocks             | Add new stock                        |
| PUT    | /api/stocks/{id}        | Update stock                         |
| DELETE | /api/stocks/{id}        | Delete stock                         |
| GET    | /api/stocks/search?q=   | Search by ticker or company name     |
| GET    | /api/stocks/alerts      | Stocks below alert threshold         |
| PATCH  | /api/stocks/{id}/price  | Update current price only            |

## Seed Data

The backend auto-loads 5 sample stocks (AAPL, GOOGL, MSFT, TSLA, AMZN) on first startup.
