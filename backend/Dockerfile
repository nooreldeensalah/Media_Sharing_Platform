FROM node:22-bullseye-slim

# Install required packages for better-sqlite3 and build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

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
