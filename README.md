# Online Auction System

A full-stack Online Auction System consisting of:
- A React + Vite frontend (single-page application)
- A Java (Maven) backend (Spring-style layout present)
- Container and deployment manifests for Docker and (scaffold) Kubernetes

This repository contains a minimal root README; the purpose of this document is to provide a thorough guide covering repo layout, how to run the project locally, how to build and deploy with Docker, and pointers for contributors.

---

## Table of contents

- [Project overview](#project-overview)
- [Tech stack](#tech-stack)
- [Key features & routes (frontend)](#key-features--routes-frontend)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local development](#local-development)
  - [Backend (Java / Maven)](#backend-java--maven)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Docker & docker-compose](#docker--docker-compose)
- [Kubernetes (notes)](#kubernetes-notes)
- [CI / Deployment pipeline](#ci--deployment-pipeline)
- [Environment variables](#environment-variables)
- [Testing & quality tools](#testing--quality-tools)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Acknowledgements & references](#acknowledgements--references)
- [License](#license)

---

## Project overview

This project is an Online Auction System designed to let users register, list products, bid on items, view product details, and manage their listings. The frontend is implemented in modern JavaScript using React + Vite. The backend is a Java Maven project (conventional `src/main/java` layout is present) intended to expose REST endpoints consumed by the SPA.

The repo contains tooling to:

- Run frontend and backend locally
- Build container images (Dockerfiles present for both frontend and backend)
- Orchestrate services with `docker-compose.yml`
- (Scaffold) Kubernetes manifests are placed in `k8s/` for future deployments
- A deploy pipeline manifest is present at the repository root (`deploy.yaml`)

---

## Tech stack

- Frontend: React (Vite) — see `online-auction-system-frontend/`
- Backend: Java (Maven) — see `online-auction-system-backend/`
- Containerization: Docker (`dockerfile` in each subproject)
- Orchestration: docker-compose (`docker-compose.yml`) and a `k8s/` directory for Kubernetes manifests
- CI / Deployment: `deploy.yaml` (present at repo root)

Languages by composition in the repository:
- JavaScript (~94%)
- Java (~3.5%)
- CSS (~2.1%)

---

## Key features & routes (frontend)

The frontend's router (see `online-auction-system-frontend/src/App.jsx`) exposes the following routes:

- `/` — Landing page
- `/login` — Login page
- `/signup` — Signup page
- `/dashboard/all` — All products listing
- `/dashboard/mine` — My (user's) products
- `/profile` — User profile
- `/product/:id` — Product detail / bidding view

This gives you the main user flows expected in an auction app: browse, view, authenticate, and manage listings.

For more details about the frontend template and how it’s set up, see:
- [online-auction-system-frontend/README.md](https://github.com/ChakraVaishnav/Online-Auction-System/blob/main/online-auction-system-frontend/README.md)

---

## Repository structure (high level)

- `.github/` — GitHub configuration (exists)
- `online-auction-system-frontend/` — React + Vite frontend
  - `.env.local`, `.env.docker`, `.env.k8s` — environment file templates
  - `dockerfile` — Dockerfile for frontend image
  - `src/` — React source, including `App.jsx` and `pages/`
  - `vite.config.js`, `tailwind.config.cjs`, `postcss.config.cjs`
- `online-auction-system-backend/` — Java backend (Maven)
  - `pom.xml` — Maven build file
  - `mvnw`, `mvnw.cmd` — Maven wrapper
  - `dockerfile` — Dockerfile for backend image
  - `src/main/java/com/online_auction_system_backend/` — Java package path
  - `src/main/resources/` — resources folder (exists)
- `docker-compose.yml` — top-level compose file to run services together
- `deploy.yaml` — deployment pipeline manifest (CI/CD)
- `k8s/` — Kubernetes manifests (scaffold/placeholder)
- `hosts.ini` — hosts mapping for deployment/testing (exists)

---

## Prerequisites

To run or develop this project you will typically need:

- Git
- Node.js (LTS recommended) and npm or yarn
- Java 11+ (or the version required by backend; check `pom.xml`)
- Maven (optional if you use the included `mvnw` wrapper)
- Docker & docker-compose (for containerized runs)
- (Optional) kubectl / Kubernetes cluster for k8s deploys

---

## Local development

This section gives example steps to run frontend and backend locally for development.

### Backend (Java / Maven)

1. Enter backend folder:
   cd online-auction-system-backend

2. Build:
   - With wrapper (recommended):
     - macOS / Linux: `./mvnw clean package`
     - Windows: `mvnw.cmd clean package`
   - Or with installed Maven: `mvn clean package`

3. Run:
   - If build produces a standalone jar, run:
     `java -jar target/*.jar`
   - Or run from your IDE (import as a Maven project).

Notes:
- The backend layout follows a standard Maven structure (`src/main/java` and `src/main/resources`).
- Check `pom.xml` for dependencies, Java version, and any special profiles.

### Frontend (React + Vite)

1. Enter frontend folder:
   cd online-auction-system-frontend

2. Install dependencies:
   `npm install` (or `yarn`)

3. Local dev:
   `npm run dev` — runs the Vite dev server (hot reload)

4. Build for production:
   `npm run build`

5. Preview the production build:
   `npm run serve` (if a serve script is present) or serve the `dist/` directory with a static server.

Environment variables:
- The frontend contains `.env.local`, `.env.docker` and `.env.k8s` templates. Ensure the API base URL variable(s) are set (commonly REACT_APP_API_URL or VITE_API_URL depending on how the app reads env vars). Example:
  ```
  VITE_API_URL=http://localhost:8080/api
  ```

---

## Docker & docker-compose

The repository contains Dockerfiles for both frontend and backend as well as a top-level `docker-compose.yml` to run the entire stack together.

Typical quickstart:

1. Build & start (from repo root):
   docker-compose up --build

2. Run in background:
   docker-compose up -d --build

3. Stop:
   docker-compose down

Notes:
- Inspect `docker-compose.yml` for service names, exposed ports, volumes, and environment variables used for container runtime.
- Frontend and backend Dockerfiles are located at:
  - `online-auction-system-frontend/dockerfile`
  - `online-auction-system-backend/dockerfile`

---

## Kubernetes (notes)

- A `k8s/` directory exists as a placeholder for Kubernetes manifest(s). If you plan to deploy to a cluster:
  - Convert docker-compose or existing Dockerfiles into Deployment, Service, and Ingress manifests.
  - Use `kubectl apply -f k8s/` to deploy when manifests are ready.
  - Make sure to create Secrets or ConfigMaps for environment variables.

---

## CI / Deployment pipeline

- A `deploy.yaml` file exists at the repository root. This likely contains a pipeline configuration or deployment manifest used by a CI/CD system. Inspect and adapt it to your CI provider (GitHub Actions, GitLab CI, etc.) as needed.

---

## Environment variables (examples)

Frontend (in `.env.local`, `.env.docker`, etc. — adapt names to the app's expectations):

```
# Example variables (adjust to app):
VITE_API_URL=http://localhost:8080
VITE_OTHER_CONFIG=value
```

Backend (example patterns — check `src/main/resources` and your code for exact names):

```
# Example (adjust to the backend's configuration)
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/auctiondb
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=changeme
```

Always keep secrets out of the repository. Use environment variable files in local development or secrets/ConfigMaps in production.

---

## Testing & quality tools

- Frontend includes ESLint configuration (`eslint.config.js`) and uses Vite — run linter and tests as configured in `package.json`.
- Backend: unit/integration tests (if included) can be run via:
  `./mvnw test`

---

## Contributing

Contributions are welcome. Suggested steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Implement changes and add tests
4. Run the project and tests locally
5. Open a pull request with a clear description of changes

Please follow the code style conventions used in the project. Make sure linting and tests pass.

---

## Troubleshooting

- If ports conflict, check `docker-compose.yml` for bound ports and adjust.
- If the frontend can't reach the backend, confirm the `VITE_API_URL` / `REACT_APP_API_URL` is set and matches where the backend is listening (consider CORS settings on the backend).
- For Java build issues, ensure Java and Maven versions match the `pom.xml` configuration.

---

## Acknowledgements & references

- Frontend scaffold is based on Vite + React template (see `online-auction-system-frontend/README.md`).
- Standard Maven project layout and wrappers are included for the backend.

---

## Where to look next (important files)

- Frontend README and source:
  - [online-auction-system-frontend/README.md](https://github.com/ChakraVaishnav/Online-Auction-System/blob/main/online-auction-system-frontend/README.md)
  - [online-auction-system-frontend/src/App.jsx](https://github.com/ChakraVaishnav/Online-Auction-System/blob/main/online-auction-system-frontend/src/App.jsx)
- Backend:
  - `online-auction-system-backend/pom.xml`
  - `online-auction-system-backend/dockerfile`
  - `online-auction-system-backend/mvnw` & `mvnw.cmd`
- Orchestration and deployment:
  - `docker-compose.yml`
  - `deploy.yaml`
  - `k8s/`

---

## License

No license file was found in the repository root. If you plan to publish or share this project, add a `LICENSE` file to declare how it may be used. A commonly used permissive license is the MIT License — create `LICENSE` and commit it.

---

If you want, I can:
- Produce a ready-to-commit README.md (this file) in the repo,
- Generate sample `.env.*` templates with recommended variables,
- Create a CONTRIBUTING.md or a LICENSE file for the project.
