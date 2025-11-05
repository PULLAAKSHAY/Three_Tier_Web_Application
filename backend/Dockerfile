# Builder stage - use QEMU for proper cross-compilation
FROM --platform=linux/amd64 node:20.19.5-bookworm AS builder

# Install QEMU for cross-architecture execution and build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    qemu-user-static \
    python3 make g++ libsqlite3-dev ca-certificates pkg-config \
    build-essential libssl-dev curl wget git libatomic1 \
    file binutils && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Set build environment variables for cross-compilation
ENV npm_config_build_from_source=true
ENV npm_config_unsafe_perm=true
ENV npm_config_arch=x64
ENV npm_config_target_arch=x64
ENV npm_config_disturl=https://nodejs.org/download/release
ENV CC=x86_64-linux-gnu-gcc
ENV CXX=x86_64-linux-gnu-g++
ENV CFLAGS=-m64
ENV CXXFLAGS=-m64
ENV LDFLAGS=-m64

# Clear npm cache and install dependencies with cross-compilation
RUN npm cache clean --force && \
    npm ci --omit=dev --verbose && \
    npm rebuild better-sqlite3 --build-from-source --verbose

# Copy application source
COPY . .

# Verify the native module was built correctly for x86_64 Linux
RUN ls -la /app/node_modules/better-sqlite3/build/Release/ && \
    file /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node && \
    echo "✅ Architecture verification passed" && \
    readelf -h /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node || true

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
    echo "✅ Runtime architecture verification passed" && \
    ldd /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node || true

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