# Use the official Node.js image as the base image
FROM node:lts

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
