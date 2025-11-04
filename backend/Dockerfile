# ============================================================
# ✅ OPTIMIZED DOCKERFILE - Better-SQLite3 built from source
# ============================================================

FROM node:20-bookworm AS builder

# Install ONLY required build dependencies (sqlite3 client not needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ libsqlite3-dev ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency manifests first for caching
COPY package*.json ./

# Force source build for better-sqlite3 via ENV (npm flags are invalid)
ENV npm_config_build_from_source=true
ENV npm_config_unsafe_perm=true

# Install dependencies (omit dev dependencies for production)
RUN npm ci --omit=dev

# Explicit rebuild for better-sqlite3 (redundant but safe)
RUN npm rebuild better-sqlite3

# Copy application source
COPY . .

# ============================================================
# ✅ Production runtime image
# ============================================================
FROM node:20-bookworm-slim

# Install required runtime dependencies (SQLite shared lib)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsqlite3-0 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app /app

# Security hardening: non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]