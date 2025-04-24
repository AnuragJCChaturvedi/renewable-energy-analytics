# Analyze Renewable Energy

A full-stack web application to visualize renewable energy monthly consumption and generation trends. The app includes secure authentication and interactive charts based on monthly energy data.

---

## Project Structure

- `backend/`: FastAPI-based REST API with JWT authentication, PostgreSQL (RDS), Alembic migrations, and test suite.
- `frontend/`: React + TypeScript dashboard built with Vite, styled using Tailwind CSS, and secured with JWT tokens.

---

## Setup using Docker Compose

### 1. Clone and Navigate

```bash
git clone https://github.com/anuragjcchaturvedi/analyze-renewal-energy.git
cd analyze-renewal-energy
```

### 2. Environment Setup

- **Backend**: Create `backend/.env` using your RDS configuration:

```env
DB_URL=postgresql+psycopg2://postgres:password@your-rds-endpoint:5432/yourdbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
```

- **Frontend**: Create `frontend/.env` (or copy from `.env.example`):

```env
VITE_BACKEND_HOST=backend
VITE_BACKEND_PORT=8000
VITE_TOKEN_KEY=token
```

### 3. Run with Docker

```bash
docker compose up --build
```

The app will be available at: http://localhost:5173

> ⚠️ Since the backend uses a remote PostgreSQL RDS instance, **run migrations manually** before using the app:
```bash
docker compose exec backend alembic upgrade head
docker compose exec backend python scripts/seed.py
```

---

## Backend Details

### Technologies

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL (RDS)
- Pytest

### Features

- User registration and login via `/auth`
- JWT-based authentication for all `/energy` routes
- Energy data APIs:
  - `/energy/trends`
  - `/energy/composition`
  - `/energy/summary`
  - `/energy/composed`

### Database Schema

- **User** (`users`):
  - `id`: PK
  - `email`, `username`: unique, indexed
  - `hashed_password`
  - `created_at`

- **EnergySource** (`energy_sources`):
  - `id`: PK
  - `name`: unique

- **EnergyType** (`energy_types`):
  - `id`: PK
  - `name`: "generation" or "consumption"

- **EnergyTrack** (`energy_tracks`):
  - `id`: PK
  - `source_id`: FK → `energy_sources.id`
  - `type_id`: FK → `energy_types.id`
  - `month`: 1–12
  - `kwh`: numeric

### Local Development

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Migrations

```bash
cd backend
alembic upgrade head
```

### Seeding Data

```bash
python scripts/seed.py
```

### Testing

```bash
PYTHONPATH=backend pytest backend/tests
```

---

## Frontend Details

### Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Recharts

### Features

- Secure JWT authentication (Login/Register)
- Dynamic charts with filters:
  - Trends (line chart)
  - Composition (stacked bar)
  - Summary (pie chart)
  - Composed view (bar + line)

### Local Development

```bash
cd frontend
npm install
npm run dev
```

To preview production build (used in Docker):

```bash
npm run build
npm run preview -- --host
```

---

## Summary

You can either run the app using local development commands listed above or use the Docker Compose setup, which encapsulates both frontend and backend services.

The `docker-compose.yml` file is located at the project root.

To run the entire application using Docker Compose:

```bash
docker compose up --build
```

This will build the images and start both services.

- Frontend: http://localhost:5173  
- Backend: http://localhost:8000 (API only)

Make sure to configure `.env` files properly in both `backend/` and `frontend/` folders before running this command.


---
