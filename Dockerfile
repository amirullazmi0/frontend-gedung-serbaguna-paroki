# Gunakan image Node.js ringan dari Alpine
FROM node:18-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json untuk instalasi dependencies
COPY package.json package-lock.json ./

# Install dependencies untuk menjalankan aplikasi (tanpa build karena sudah dilakukan di GitHub)
RUN npm install --legacy-peer-deps

# Salin hasil build dan file terkait dari file tar (Proses ini dilakukan setelah build selesai di GitHub)
COPY .next/standalone /app/.next/standalone
COPY .env.staging .env
COPY package.json /app/package.json

# Expose port 80 untuk CapRover (HTTP)
EXPOSE 80

# Command untuk menjalankan aplikasi Next.js dalam mode standalone
CMD ["node", "server.js"]
