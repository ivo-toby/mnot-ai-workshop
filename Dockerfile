FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and global tools
RUN npm install
RUN npm install -g ts-node typescript

# Copy app source
COPY . .

# Build server and client
RUN npm run build

# Expose the port the app will run on
EXPOSE 3001

# Command to run the app with migrations will be provided by docker-compose
CMD ["node", "build/server.js"]
