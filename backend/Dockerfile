# ======================================================
# ✅ FINAL FIX — better-sqlite3 built from source (Node 20 bookworm)
# ======================================================

FROM node:20-bookworm AS builder

# Install full build environment + SQLite dev libs
RUN apt-get update && apt-get install -y \
    python3 make g++ libsqlite3-dev sqlite3 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only package manifests first
COPY package*.json ./

# Force rebuild better-sqlite3 from source in correct environment
RUN npm install better-sqlite3 --build-from-source
RUN npm ci --omit=dev

# Copy the rest of your app
COPY . .

# ======================================================
# Runtime Image
# ======================================================
FROM node:20-bookworm-slim

WORKDIR /app
COPY --from=builder /app /app

# Confirm that the native binary was built properly
RUN ls -l /app/node_modules/better-sqlite3/build/Release/ || true

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "src/app.js"]
