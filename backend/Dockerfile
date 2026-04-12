FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json yarn.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN yarn install --frozen-lockfile --ignore-scripts

COPY tsconfig.base.json ./
COPY backend backend
COPY packages packages

EXPOSE 3000

CMD ["yarn", "workspace", "backend", "start:dev"]
