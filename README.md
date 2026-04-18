# UXTweak Chat App

Realtime chat application built with:
- Vue + Quasar frontend
- NestJS + Socket.IO backend
- PostgreSQL + Prisma for persisted message history

## Docker Compose

Prerequisite:
- Docker Desktop

Run the full stack:

```bash
docker compose up -d
```

Available at:
- frontend: `http://localhost:9000`
- backend: `http://localhost:3000`

`backend/.env` is not required for the Docker flow. Prisma Client is generated during the backend image build and Prisma migrations are applied automatically before the backend starts.

## Local development

Prerequisites:
- Node.js
- Yarn
- Docker Desktop or a local PostgreSQL instance

Setup:

```bash
yarn install
cp backend/.env.example backend/.env
docker compose up -d postgres
cd backend && yarn prisma:migrate:deploy
```

Start the apps in separate terminals:

```bash
yarn workspace backend start:dev
```

```bash
yarn workspace frontend dev
```

The backend start scripts generate the Prisma client automatically before startup.

## Testing

Backend:

```bash
yarn workspace backend test
yarn workspace backend test:e2e
```

Frontend:

```bash
yarn workspace frontend test
yarn workspace frontend test:e2e
```

Before running frontend e2e tests, the full stack must already be running.

## Architecture notes

- Message history is persisted in PostgreSQL through Prisma.
- Online presence is runtime-only and kept in websocket gateway memory.
- After a backend restart, message history remains but online presence resets.
- Shared transport types and validation schemas live in `@chat-app/contracts`.

## Known limitations

- Message history is loaded as a single list; pagination is not implemented.
- The message list does not use virtual scrolling.
- Automatic scrolling to the latest message is not implemented.
- There is no registration or authentication flow.
- Users join by choosing a display name, validated only for current runtime uniqueness.

## Testing note

Backend e2e tests run against the configured database and are not isolated behind a dedicated test database. In a larger project, I would separate them behind a test-specific database and environment configuration.

## AI usage

AI was used for guidance, debugging, troubleshooting, Docker setup, and testing configuration. The assignment was implemented manually by me. AI was used as an assistant for discussion, diagnosis, and iteration, not as a blind end-to-end code generator.
