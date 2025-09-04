FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# copy source code
COPY . .

ENV NODE_ENV=production
EXPOSE 4003

CMD ["node", "src/index.js"]
