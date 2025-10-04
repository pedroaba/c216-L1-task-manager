FROM node:23-alpine as builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

FROM node:23-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
