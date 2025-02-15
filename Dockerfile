# Base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app/
RUN npm install

# Copy the rest of the application
COPY . /app/

# Expose port 8000 for the API
EXPOSE 8000

# Run the server
CMD ["node", "docker-server.js"]



