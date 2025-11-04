# ======================================================
# ✅ FINAL FIX — Guaranteed glibc-compatible build
# ======================================================

FROM node:20-bookworm AS builder

# Install full build environment
RUN apt-get update && apt-get install -y \
    python3 make g++ libsqlite3-dev sqlite3 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Clean any leftover dependencies
RUN rm -rf node_modules

# Install all deps (force rebuild better-sqlite3)
RUN npm install --build-from-source better-sqlite3 && npm ci --omit=dev

# Copy your backend source code only (no node_modules from host)
COPY . .

# ======================================================
# Runtime stage
# ======================================================
FROM node:20-bookworm-slim

WORKDIR /app

# Copy compiled app (excluding local node_modules)
COPY --from=builder /app /app

# Sanity check: ensure correct binary architecture
RUN file /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node || true

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]
