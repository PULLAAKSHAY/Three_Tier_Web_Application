# ======================================================
# ✅ Backend Dockerfile (Node 22 + better-sqlite3 fix)
# Fully compatible with Alpine 3.19–3.20 and Node 22.x
# ======================================================

FROM node:22-alpine AS build

# Install full build toolchain for native modules (better-sqlite3)
RUN apk add --no-cache python3 python3-dev make g++ pkgconfig

WORKDIR /app
COPY package*.json ./

# Use npm install to avoid Alpine's musl prebuild mismatch
RUN npm install --omit=dev

# Copy rest of the source code
COPY . .

# ======================================================
# Final minimal runtime image
# ======================================================
FROM node:22-alpine

WORKDIR /app
COPY --from=build /app /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]
