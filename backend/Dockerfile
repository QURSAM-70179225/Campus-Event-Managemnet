# ---------- Stage 1: install dependencies ----------
# The full node image already has python3/make/g++, needed to build better-sqlite3
FROM node:20 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ---------- Stage 2: small runtime image ----------
FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000 \
    DB_PATH=/app/data/campus_events.db

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# SQLite database lives in /app/data (mounted as a volume so data survives restarts)
RUN mkdir -p /app/data

EXPOSE 5000
CMD ["node", "server.js"]
