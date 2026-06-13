# syntax=docker/dockerfile:1
ARG PNPM_VERSION=9.15.9

FROM node:20-alpine AS deps
WORKDIR /app
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
ARG SERVICE_NAME
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec nest build ${SERVICE_NAME}

FROM node:20-alpine AS runner
WORKDIR /app
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
ARG SERVICE_NAME
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "node dist/apps/${SERVICE_NAME}/main"]
