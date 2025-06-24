# Build stage
FROM node:18-alpine AS builder
LABEL maintainer="DevOps"

# Set working directory
WORKDIR /app

# Install bash (needed for some operations)
RUN apk add --no-cache bash

# Copy all files to the container
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=builder /app/.next/standalone /app/
COPY --from=builder /app/.env.staging .env

# Expose the port that Next.js will run on
EXPOSE 3000

# Command to run the Next.js app
CMD ["npm", "start"]
