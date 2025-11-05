# Builder stage - match Ubuntu 24.04 environment
FROM node:20.19.5 AS builder

# Install build dependencies compatible with Ubuntu 24.04
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ libsqlite3-dev ca-certificates pkg-config \
    build-essential libssl-dev curl wget git libatomic1 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Set proper build environment variables
ENV npm_config_build_from_source=true
ENV npm_config_unsafe_perm=true
ENV npm_config_arch=x64

# Clear cache and install dependencies
RUN npm cache clean --force && npm ci --omit=dev --verbose

# Force rebuild better-sqlite3 with verbose logging
RUN npm rebuild better-sqlite3 --build-from-source --verbose

# Copy application source
COPY . .

# ============================================================
# Production runtime image
# ============================================================
FROM node:20.19.5-slim

# Install runtime dependencies matching Ubuntu 24.04
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsqlite3-0 libstdc++6 libc6 libatomic1 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app /app

# Verify the native module was built correctly
RUN ls -la /app/node_modules/better-sqlite3/build/Release/ && \
    file /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node || true

# Security hardening
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs && \
    chown -R nextjs:nodejs /app
USER nextjs

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD node -e "require('better-sqlite3')" || exit 1

CMD ["node", "src/app.js"]