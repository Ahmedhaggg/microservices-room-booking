# Meeting Room Booking

NestJS microservices monorepo for a meeting room booking system.

## Services

- `auth-service`
- `booking-service`
- `rooms-service`
- `notification-service`

Each service has:

- its own Nest application under `apps/<service>`
- its own PostgreSQL database
- its own Drizzle schema and migration history under `apps/<service>/src/db`

Shared database helpers live under `libs/shared/src/database`.

## Tech stack

- NestJS
- PostgreSQL
- Drizzle ORM
- Docker Compose
- Jest
- Testcontainers

## Prerequisites

- Node.js 20+
- `pnpm`
- Docker Desktop or Docker Engine

## Install dependencies

```bash
pnpm install
```

## Project structure

```text
apps/
  auth-service/
  booking-service/
  rooms-service/
  notification-service/
libs/
  common/
  shared/
```

## Run infrastructure

Start all databases, RabbitMQ, and all services with Docker Compose:

```bash
docker compose up --build
```

Start only the databases and RabbitMQ:

```bash
docker compose up -d auth-db booking-db rooms-db notification-db rabbitmq
```

## Database configuration

Each service uses the following database environment variables:

```bash
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
```

## Environment files

Recommended approach: use one env file per service.

Why this is the better fit here:

- each microservice has its own database
- each microservice can be started independently
- each microservice may later have different secrets and external integrations
- this matches how microservices are usually deployed in real environments

Example env files are included:

- `apps/auth-service/.env.example`
- `apps/booking-service/.env.example`
- `apps/rooms-service/.env.example`
- `apps/notification-service/.env.example`

Suggested local setup:

1. Copy the service example file to a real env file for that service.
2. Adjust values if your local ports or credentials differ.
3. Start the matching database container.
4. Run that service.

Example for booking service:

```bash
Copy-Item apps/booking-service/.env.example apps/booking-service/.env
```

Then load the values in your shell before starting the service, or configure your editor/run profile to use that file.

If you want a single env file for the whole project, it can work for local development only, but it is not the best structure for this repo because the services do not share the same database credentials.

Docker Compose already provides the correct values for each service:

| Service | DB Host | DB User | DB Name | App Port |
| --- | --- | --- | --- | --- |
| `auth-service` | `auth-db` | `auth_user` | `auth_db` | `3001` |
| `booking-service` | `booking-db` | `booking_user` | `booking_db` | `3002` |
| `rooms-service` | `rooms-db` | `rooms_user` | `rooms_db` | `3003` |
| `notification-service` | `notification-db` | `notification_user` | `notification_db` | `3004` |

## Run the project locally

Start one service locally:

```bash
pnpm run start:auth-service
pnpm run start:booking-service
pnpm run start:rooms-service
pnpm run start:notification-service
```

Start the default service in watch mode:

```bash
pnpm run start:dev
```

Start a specific service in watch mode:

```bash
pnpm run start:dev:auth-service
pnpm run start:dev:booking-service
pnpm run start:dev:rooms-service
pnpm run start:dev:notification-service
```

Build all services:

```bash
pnpm run build
```

Build one service:

```bash
pnpm run build:auth-service
pnpm run build:booking-service
pnpm run build:rooms-service
pnpm run build:notification-service
```

## Run Drizzle migrations

### Generate migrations

Run this after changing a service schema:

```bash
pnpm run db:generate:auth-service
pnpm run db:generate:booking-service
pnpm run db:generate:rooms-service
pnpm run db:generate:notification-service
```

Generate for all services:

```bash
pnpm run db:generate:all
```

### Apply migrations

Make sure the target database for that service is running and the correct DB env vars are set.

Examples:

```bash
pnpm run db:migrate:auth-service
pnpm run db:migrate:booking-service
pnpm run db:migrate:rooms-service
pnpm run db:migrate:notification-service
```

Run all migrations:

```bash
pnpm run db:migrate:all
```

### Example local migration flow

1. Start the needed database container:

```bash
docker compose up -d auth-db
```

2. Export the auth database env vars:

```bash
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_USER="auth_user"
$env:DB_PASSWORD="auth_pass"
$env:DB_NAME="auth_db"
```

3. Run the migration:

```bash
pnpm run db:migrate:auth-service
```

Repeat the same pattern for the other services using their own credentials.

Example local env values for booking service:

```bash
$env:NODE_ENV="development"
$env:port="3000"
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_USER="booking_user"
$env:DB_PASSWORD="booking_pass"
$env:DB_NAME="booking_db"
$env:RABBITMQ_HOST="localhost"
$env:RABBITMQ_PORT="5672"
$env:RABBITMQ_USER="guest"
$env:RABBITMQ_PASSWORD="guest"
$env:RABBITMQ_URL="amqp://guest:guest@localhost:5672"
```

## Run tests

Run all unit tests:

```bash
pnpm run test
```

Run all e2e tests:

```bash
pnpm run test:e2e
```

Run one service e2e suite:

```bash
pnpm run test:e2e:auth-service
pnpm run test:e2e:booking-service
pnpm run test:e2e:rooms-service
pnpm run test:e2e:notification-service
```

Run coverage:

```bash
pnpm run test:cov
```

## How e2e tests work

The e2e tests use Testcontainers.

For each service test suite:

- a real PostgreSQL container is started
- the service's Drizzle migrations are applied
- the Nest application boots against that real database
- the tests call the HTTP endpoints and verify database connectivity

This means e2e tests require Docker to be running.

## Useful commands

Format code:

```bash
pnpm run format
```

Lint code:

```bash
pnpm run lint
```

Run production entrypoint for a built service:

```bash
pnpm run start:prod:auth-service
pnpm run start:prod:booking-service
pnpm run start:prod:rooms-service
pnpm run start:prod:notification-service
```
