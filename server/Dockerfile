FROM node:23-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install all dependencies (including dev dependencies for tsx)
RUN pnpm install --frozen-lockfile

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm prisma generate

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Run migrations and start server
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm tsx src/server.ts"]

