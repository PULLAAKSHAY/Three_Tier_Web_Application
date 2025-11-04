# ======================================================
# ✅ Backend Dockerfile (Node 20-slim + better-sqlite3 stable)
# ======================================================

FROM node:20-slim AS build

# Install full build toolchain
RUN apt-get update && apt-get install -y python3 make g++ pkg-config sqlite3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./

RUN npm ci --omit=dev
COPY . .

FROM node:20-slim
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/app.js"]
