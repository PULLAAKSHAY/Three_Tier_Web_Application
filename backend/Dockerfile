# ======================================================
# ✅ FINAL FIX — builds better-sqlite3 inside bookworm
# ======================================================

# Stage 1 — Builder
FROM node:20-bookworm AS builder

# Install build tools & SQLite headers
RUN apt-get update && apt-get install -y \
    python3 make g++ libsqlite3-dev sqlite3 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies and force build better-sqlite3 from source
RUN npm install --build-from-source better-sqlite3 --omit=dev

# Copy rest of application
COPY . .

# Stage 2 — Runtime
FROM node:20-bookworm-slim

WORKDIR /app

# Copy all built files and native binaries from builder
COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "src/app.js"]
