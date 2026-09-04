FROM node:22-alpine

WORKDIR /app

COPY Backend/package*.json ./

RUN npm ci --omit=dev

COPY Backend/ ./

EXPOSE 5000

CMD ["node", "server.js"]
