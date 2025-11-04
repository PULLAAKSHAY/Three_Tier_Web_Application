# ======================================================
# ✅ FINAL VERIFIED FIX — Forces native glibc build
# ======================================================
FROM node:20-bookworm AS builder

# Install full build environment for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 make g++ libsqlite3-dev sqlite3 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first (to leverage build cache)
COPY package*.json ./

# Clean node_modules just in case
RUN rm -rf node_modules

# Force native compilation (ignore prebuilt binaries)
ENV npm_config_build_from_source=true
ENV npm_config_force_process_config=true
ENV npm_config_unsafe_perm=true

# Install better-sqlite3 explicitly first to trigger native build
RUN npm install better-sqlite3 --build-from-source

# Then install the rest of production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# ======================================================
# Runtime stage
# ======================================================
FROM node:20-bookworm-slim

WORKDIR /app

# Copy compiled app from builder stage
COPY --from=builder /app /app

# Verify correct ELF format (glibc)
RUN file /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node || true

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]
