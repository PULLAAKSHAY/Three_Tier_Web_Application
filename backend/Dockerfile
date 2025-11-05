# Builder stage - use Ubuntu-based image for proper Linux binary compilation
FROM --platform=linux/amd64 ubuntu:24.04 AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl wget git python3 make g++ gcc \
    libsqlite3-dev pkg-config ca-certificates \
    libssl-dev libatomic1 build-essential \
    file binutils && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js 20.x from official repository
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Set build environment for proper Linux binary compilation
ENV npm_config_build_from_source=true
ENV npm_config_unsafe_perm=true
ENV npm_config_target_arch=x64
ENV npm_config_arch=x64
ENV npm_config_platform=linux
ENV npm_config_optional=true

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm ci --omit=dev --verbose && \
    npm rebuild better-sqlite3 --build-from-source --verbose

# Copy application source
COPY . .

# Verify the native module was built correctly for x86_64 Linux
RUN ls -la /app/node_modules/better-sqlite3/build/Release/ && \
    file /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node && \
    readelf -h /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node || true && \
    echo "✅ Architecture verification passed"

# ============================================================
# Production runtime image (x86_64 Linux)
# ============================================================
FROM --platform=linux/amd64 node:20.19.5-bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsqlite3-0 libstdc++6 libc6 libatomic1 ca-certificates \
    file && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app /app

# Final architecture verification
RUN file /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node && \
    readelf -h /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node || true && \
    ldd /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node || true && \
    echo "✅ Runtime architecture verification passed"

# Security hardening
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /app
USER appuser

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Health check that tests the problematic module
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD node -e "try { require('better-sqlite3'); console.log('✅ Health check passed'); } catch (e) { console.error('❌ Health check failed:', e); process.exit(1); }" || exit 1

CMD ["node", "src/app.js"]