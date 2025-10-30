# ---- Étape build : construit le React app ----
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Étape runtime : exécute le serveur Node ----
FROM node:18-alpine
WORKDIR /app

# Copie le build React et le serveur
COPY --from=build /app/dist ./dist
COPY server ./server
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 80
CMD ["node", "server/server.js"]
