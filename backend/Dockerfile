# Use full Debian-based image to ensure binary compatibility
FROM node:20-bookworm-slim

# Install required build tools and libraries for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ libsqlite3-dev sqlite3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Clean any prebuilt native modules and install dependencies fresh
RUN npm install --build-from-source better-sqlite3 --omit=dev

# Copy the rest of your backend code
COPY . .

# Environment and port settings
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run the app
CMD ["node", "src/app.js"]
