# ====================================
# ReportIQ Backend Dockerfile
# Multi-stage production build for NestJS + Prisma
# ====================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package definition files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy full source code
COPY . .

# Generate Prisma Client and build NestJS application
RUN npx prisma generate
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copy node_modules and built application from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

# Start production server
CMD ["node", "dist/main"]
