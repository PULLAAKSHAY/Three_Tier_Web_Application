# Use full Debian-based Node image for both build & runtime
FROM node:20-bookworm-slim

# Install dependencies needed for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ libsqlite3-dev sqlite3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for dependency caching
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy all source files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose backend port
EXPOSE 3000

# Start the backend
CMD ["node", "src/app.js"]
