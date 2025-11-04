# ======================================================
# ✅ Backend Dockerfile (Node 22-slim + better-sqlite3 fix)
# ======================================================

FROM node:22-slim AS build

# Install required packages to compile native addons
RUN apt-get update && apt-get install -y \
    python3 make g++ pkg-config sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./

# Install production dependencies (compile better-sqlite3 cleanly)
RUN npm ci --omit=dev

# Copy source code
COPY . .

# ======================================================
# Final minimal runtime image
# ======================================================
FROM node:22-slim

WORKDIR /app
COPY --from=build /app /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]
