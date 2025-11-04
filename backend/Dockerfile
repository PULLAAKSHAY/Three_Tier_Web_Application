# ======================================================
# Backend Dockerfile (Node 22 + better-sqlite3 fix)
# ======================================================

FROM node:22-alpine AS build

# Install build dependencies for native Node modules
RUN apk add --no-cache python3 py3-setuptools make g++ pkgconfig

WORKDIR /app
COPY package*.json ./

# Install production dependencies (compile native modules)
RUN npm ci --omit=dev

# Copy application code
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
