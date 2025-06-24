FROM node:18-alpine

WORKDIR /app
COPY .next/ .next/
COPY package.json package-lock.json ./
COPY --from=builder /app/.next/standalone ./

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "server.js"]