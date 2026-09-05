# Use official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Environment variables (to be overridden by Cloud Run)
ENV PORT=8080

# Define the command to run the app
CMD [ "node", "server.js" ]
