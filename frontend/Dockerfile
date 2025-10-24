FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag to avoid conflicts
RUN npm ci --legacy-peer-deps

# Copy application code
COPY . .

# Copy tsconfig for path aliases to work properly
COPY tsconfig.json ./

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
