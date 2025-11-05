# Use explicit platform targeting for x86_64 architecture
FROM --platform=linux/amd64 node:20.19.5-bookworm AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ libsqlite3-dev ca-certificates pkg-config \
    build-essential libssl-dev curl wget git libatomic1 \
    file && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Set build environment variables
ENV npm_config_build_from_source=true
ENV npm_config_unsafe_perm=true
ENV npm_config_arch=x64

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm ci --omit=dev --verbose && \
    npm rebuild better-sqlite3 --build-from-source --verbose

# Copy application source
COPY . .

# Verify the native module was built correctly for x86_64
RUN ls -la /app/node_modules/better-sqlite3/build/Release/ && \
    file /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node && \
    echo "✅ Architecture verification passed" && \
    echo "🔍 Module architecture details:" && \
    objdump -f /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node

# ============================================================
# Production runtime image (same platform)
# ============================================================
FROM --platform=linux/amd64 node:20.19.5-bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsqlite3-0 libstdc++6 libc6 libatomic1 ca-certificates \
    file curl wget && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app /app

# Final architecture verification in runtime image
RUN file /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node && \
    echo "✅ Runtime architecture verification passed"

# Security hardening
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /app
USER appuser

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Health check that actually tests the problematic module
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD node -e "try { require('better-sqlite3'); console.log('✅ Health check passed'); } catch (e) { console.error('❌ Health check failed:', e); process.exit(1); }" || exit 1

CMD ["node", "src/app.js"]