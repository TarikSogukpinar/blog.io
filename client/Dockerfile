# Use the official Node.js image as a base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy the package files
COPY package*.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Expose port and define command to run the app
EXPOSE 3000
CMD ["npm", "start"]