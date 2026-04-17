# UXTweak Chat App

Simple realtime chat application with:
- Vue/Quasar frontend
- NestJS backend
- Socket.IO for realtime messaging and presence
- PostgreSQL + Prisma for persisted message history

## Docker Compose

### Prerequisites
- Node.js
- Yarn
- Docker Desktop

### Install dependencies
```bash
yarn install
```

### Create backend environment file
```bash
cp backend/.env.example backend/.env
```

### First run
On the first run with a fresh PostgreSQL volume, start the stack and then apply Prisma migrations:

```bash
docker compose up
```

In a separate terminal:

```bash
cd backend
yarn prisma:migrate:deploy
```

### Later runs
If the database volume already contains the schema, start everything directly:

```bash
docker compose up
```

Prisma Client generation is handled during the backend Docker image build. Database migrations are not run automatically on container startup and must be applied manually when the database is fresh or when a new migration is added.

## Local development

### Prerequisites
- Node.js
- Yarn
- Docker Desktop or a local PostgreSQL instance

### Install dependencies
```bash
yarn install
```

### Create backend environment file
```bash
cp backend/.env.example backend/.env
```

### Start PostgreSQL
```bash
docker compose up -d postgres
```

### Apply database migrations
```bash
cd backend
yarn prisma:migrate:deploy
```

### Start the apps
In separate terminals:

```bash
yarn workspace backend start:dev
```

```bash
yarn workspace frontend dev
```

Frontend runs on `http://localhost:9001` and backend on `http://localhost:3000`.
