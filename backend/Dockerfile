# ============================================
#   Backend Dockerfile (Node 22 + better-sqlite3 fix)
# ============================================

FROM node:22-alpine AS build

# Install build tools temporarily (for native addons)
RUN apk add --no-cache python3 make g++ pkgconfig

WORKDIR /app
COPY package*.json ./

# Install production dependencies (includes better-sqlite3)
RUN npm ci --omit=dev

# Copy source code
COPY . .

# ============================================
#   Final lightweight runtime stage
# ============================================
FROM node:22-alpine

WORKDIR /app

# Copy node_modules and source from build stage
COPY --from=build /app /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]
