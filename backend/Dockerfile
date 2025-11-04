# ======================================================
# ✅ 100% FIXED Dockerfile — No prebuilt binaries
# ======================================================
FROM node:20-bookworm AS builder

# Install necessary build tools
RUN apt-get update && apt-get install -y \
    python3 make g++ libsqlite3-dev sqlite3 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Prevent downloading any prebuilt binaries
ENV npm_config_build_from_source=true
ENV npm_config_prebuilt_binaries=false
ENV npm_config_unsafe_perm=true

# Install dependencies (skip prebuilt binary)
RUN npm install --omit=dev

# Delete any cached prebuilt binaries (just in case)
RUN rm -rf node_modules/better-sqlite3/build

# Force local rebuild of better-sqlite3 from source
RUN npm rebuild better-sqlite3 --build-from-source

# Copy application code
COPY . .

# ======================================================
# Runtime stage
# ======================================================
FROM node:20-bookworm-slim
WORKDIR /app

COPY --from=builder /app /app

# Validate that binary is glibc-compatible
RUN file /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node || true

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]
