# Use the official Node.js image as the base image
FROM node:alpine

# Install required packages to work with better-sqlite3 npm package
RUN apk add g++ make python3

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create the directory for the SQLite database
RUN mkdir -p /app/database

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
