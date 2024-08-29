# Use the official Node.js image as a base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Install pnpm globally and set the pnpm store directory
RUN npm install -g pnpm \
    && pnpm config set store-dir /usr/src/app/.pnpm-store

# Copy the package files
COPY package*.json ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Uploads klasörünü kopyala
COPY uploads ./uploads

# Ensure CLI dependencies are installed (if needed)
RUN pnpm add @nestjs/cli

# Install Artillery globally
RUN npm install -g artillery

# TypeScript derleme
RUN pnpm run build

RUN ls -la dist

RUN pnpm exec prisma generate

ENV NODE_ENV=production

# Expose port and define command to run the app
EXPOSE 5000
CMD ["node", "dist/src/main.js"]