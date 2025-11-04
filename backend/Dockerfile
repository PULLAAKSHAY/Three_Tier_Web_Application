# ======================================================
# ✅ FINAL FIX — Force local glibc rebuild of better-sqlite3
# ======================================================

FROM node:20-bookworm AS builder

# Install required system packages for native builds
RUN apt-get update && apt-get install -y \
    python3 make g++ libsqlite3-dev sqlite3 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Clean node_modules to ensure no cached binaries
RUN rm -rf node_modules

# Install all deps (will fetch prebuilt binary)
RUN npm ci --omit=dev

# Force rebuild of better-sqlite3 against glibc
RUN npm rebuild better-sqlite3 --build-from-source

# Copy the rest of the application code
COPY . .

# ======================================================
# Runtime stage
# ======================================================

FROM node:20-bookworm-slim

WORKDIR /app
COPY --from=builder /app /app

# Double-check binary type (for debugging)
RUN file /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node || true

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]
