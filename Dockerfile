FROM node:20-alpine as base
RUN corepack enable pnpm
WORKDIR /app

FROM base as deps
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

FROM deps as migration
COPY . .
RUN pnpm drizzle-kit push

FROM deps as builder
COPY . .
RUN pnpm run build

FROM base as runner
COPY --from=builder /app/.next ./.next/
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
CMD [ "pnpm", "start" ]