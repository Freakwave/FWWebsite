FROM node:24-slim

ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --chown=node:node dist ./dist
COPY --chown=node:node server ./server

USER node
EXPOSE 3000
CMD ["node", "server/index.js"]
