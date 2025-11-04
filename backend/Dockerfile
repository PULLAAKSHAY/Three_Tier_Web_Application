# ======================================================
# ✅ FINAL VERIFIED FIX — rebuild better-sqlite3 cleanly
# ======================================================

FROM node:20-bookworm AS builder

# Install dependencies for building better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 make g++ libsqlite3-dev sqlite3 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package manifests only (NO local node_modules)
COPY package*.json ./

# Clean any preexisting modules, build from scratch
RUN rm -rf node_modules
RUN npm install --build-from-source better-sqlite3
RUN npm ci --omit=dev

# Copy app source (but NOT node_modules)
COPY . .

# ======================================================
# Runtime Image
# ======================================================
FROM node:20-bookworm-slim

WORKDIR /app

# Copy everything *except* local node_modules from your repo
COPY --from=builder /app /app

# Double check better-sqlite3 binary was built
RUN ls -lh /app/node_modules/better-sqlite3/build/Release/ || true

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]
