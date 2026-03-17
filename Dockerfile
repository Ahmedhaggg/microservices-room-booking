# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
ARG SERVICE_NAME
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec nest build ${SERVICE_NAME}

FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable
ARG SERVICE_NAME
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "node dist/apps/${SERVICE_NAME}/main"]
