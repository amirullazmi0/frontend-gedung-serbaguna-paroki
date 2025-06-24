FROM node:18-alpine

WORKDIR /app

COPY .next/ .next/
COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "server.js"]