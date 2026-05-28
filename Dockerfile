FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 2502

CMD ["node", "server.js"]
