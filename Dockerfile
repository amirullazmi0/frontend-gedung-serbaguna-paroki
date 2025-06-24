FROM node:18-alpine AS builder
LABEL maintainer="DevOps"
WORKDIR /app
RUN apk add --no-cache bash
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build


FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.env.staging .env
EXPOSE 3000
CMD ["node", "server.js"]