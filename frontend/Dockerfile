FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json yarn.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN yarn install --frozen-lockfile --ignore-scripts

COPY tsconfig.base.json ./
COPY frontend frontend
COPY packages packages

RUN yarn workspace frontend postinstall

WORKDIR /app/frontend

EXPOSE 9001

CMD ["yarn", "dev"]
