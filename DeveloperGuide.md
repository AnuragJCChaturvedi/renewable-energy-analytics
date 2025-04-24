# Renewable Energy App Documentation

This document provides an overview of the **backend** and **frontend** components of the Renewable Energy App, including their structure, key functionalities, and instructions for setup, testing, and deployment.

---

## Backend Documentation

The backend is built using **FastAPI** and provides RESTful APIs for managing energy-related data. It includes database models, routes, utilities, and exception handling.

### Key Components

1. **Database Models**:
   - `User`: Represents application users with fields like `email`, `username`, and `hashed_password`.
   - `EnergySource`: Represents energy sources (e.g., Solar, Wind).
   - `EnergyType`: Represents energy types (e.g., Consumption, Generation).
   - `EnergyTrack`: Tracks energy data with fields like `source_id`, `type_id`, `month`, and `kWh`.

2. **Routes**:
   - **Authentication**:
     - `/auth/register`: Registers a new user.
     - `/auth/login`: Authenticates a user and returns a JWT token.
   - **Energy Data**:
     - `/energy/trends`: Provides monthly trends for energy sources.
     - `/energy/composition`: Provides stacked-bar data for energy composition.
     - `/energy/summary`: Summarizes total kWh per source.
     - `/energy/composed`: Combines bar and line charts for total and highlighted sources.

3. **Utilities**:
   - energy_data.py: Contains helper functions for querying energy data from the database.

4. **Exception Handling**:
   - Custom handlers for validation errors, database errors, and generic exceptions.

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
2. **Start the Backend**:
   Run the FastAPI server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Testing

Run backend tests using `pytest.From the backend folder execite the following command to run tests:
```bash
PYTHONPATH=backend pytest backend/tests
```

---

## Frontend Documentation

The frontend is built using **React** with **TypeScript** and **Vite**. It provides a responsive user interface for visualizing and managing energy data.

### Key Components

1. **Pages**:
   - **Dashboard**: Displays energy data trends, composition, and summaries using charts.
   - **Authentication**: Provides login and registration forms.

2. **Context**:
   - `AuthContext`: Manages authentication state and provides helper functions for login/logout.

3. **API Integration**:
   - axios.ts: Configures Axios for making API requests with JWT token authentication.

4. **Styling**:
   - Uses **Tailwind CSS** for styling components.

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```
---

## Deployment

### Docker Compose

```bash
docker compose up --build
```

### Backend Deployment

1. Build a Docker image:
   ```bash
   docker build -t backend-image .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 backend-image
   ```

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Serve the build files using a static server or containerize the app using the provided Dockerfile.


---