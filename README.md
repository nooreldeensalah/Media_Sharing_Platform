# Media Sharing Platform

- [Media Sharing Platform](#media-sharing-platform)
  - [Architecture](#architecture)
  - [Technologies Used](#technologies-used)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Set up Environment Variables](#2-set-up-environment-variables)
  - [Running locally with Docker Compose](#running-locally-with-docker-compose)
    - [1. Build the Containers](#1-build-the-containers)
    - [2. Access the Application](#2-access-the-application)
    - [3. Running the mobile application](#3-running-the-mobile-application)
  - [Screenshots](#screenshots)
    - [Web Application](#web-application)
    - [Mobile Application](#mobile-application)
  - [Documentation](#documentation)

A full-stack media sharing application where users can upload, view, like, and delete media files. This project includes a **React** frontend, a **Fastify** backend, and **MinIO** as the storage server (compatible with AWS SDK). The backend is secured with JWT-based authentication.

## Architecture

```mermaid
graph TD
  subgraph Frontend
    ReactApp[React + Vite App]
    ReactApp --->|API Calls| Backend
  end

  subgraph Backend
    Fastify[Fastify API Server]
    SQLite[SQLite Database]
    MinIO[MinIO Storage Server]
    Fastify --> SQLite
    Fastify -->|Pre-signed URLs| MinIO

    subgraph Storage
        MinIO[(MinIO Storage)]
      end
  end



  ReactApp -->|Serve Static Files| NGINX[NGINX Server]
  MinIO -->|Object Storage| ClientBrowser[Browser]
  Fastify -->|JWT Auth| ClientBrowser[Browser]
```

## Technologies Used

- **Frontend**:
  - Built with React and TypeScript.
  - TailwindCSS for styling.

- **Backend**:
  - Node.js with Fastify (Scaffolded with `fastify-cli`).
  - JWT-based authentication.
  - Integrates with MinIO.
  - Uses `SQLite` for metadata storage;
  - Handles media file operations

- **Storage**:
  - MinIO for object storage (AWS S3 compatible).

- **Mobile**
  - Built with React Native using Expo

## Prerequisites

- Node.js (LTS)
- Docker & Docker Compose (for local deployment)
- MinIO server (or any S3-compatible object storage)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd media-sharing-platform
```

### 2. Set up Environment Variables

**Backend** environment variables

```env
# MinIO Configuration
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
BUCKET_NAME=media

# Fastify Configuration
FASTIFY_ADDRESS=0.0.0.0
FASTIFY_PORT=3000

# MISC
DATABASE_FILE_NAME=database.sqlite
JWT_SECRET=supersecret

```

> [!TIP]
> For ease of review, I've hardcoded the environment variables into the docker compose file
>
> Clone the repository and run the docker compose commands in the next section

## Running locally with Docker Compose

> [!IMPORTANT]
> If you are going to test the mobile application as well, you have to retrieve the local network address and configure the docker compose environment variables as explained in the next section

### 1. Build the Containers

```sh
docker-compose build
docker-compose up
```

### 2. Access the Application

- Frontend: `http://localhost`
- Backend: `http://localhost:3000`
- MinIO Console: `http://localhost:9000`

### 3. Running the mobile application

The easiest way to run the mobile application, would be using `Expo Go`
> [!TIP]
> Retrieve the local network address using `hostname -I`
>
> Create a `.env` file in the `mobile/` directory and set the `EXPO_PUBLIC_API_BASE_URL` environment variable to point out to the backend address on the local network address, (`localhost`) won't be accessible, so use the address `192.168.x.x` instead, which would be exposed by default using the Docker deployment
>
> Set the `S3_ENDPOINT` variable in docker compose to match the local network address as well, to be able to access the images from the MinIO bucket.

## Screenshots

### Web Application

![Web App Screenshot](screenshots/web-screenshot.jpg)

### Mobile Application

![Mobile App Screenshot](screenshots/mobile-screenshot.jpg)

## Documentation

- Documentation is automatically generated using `@fastify/swagger` plugin, which uses JSON schemas, under the hood Fastify uses `ajv` to validate the schemas.
- Documentation is accessible at `http://localhost:3000/docs`

> [!NOTE]
> I've attempted various non-paid cloud deployment options such as `Fly.io` and `Vercel` but I wasn't impressed with the latency and the cold start so I decided to use Docker Compose instead.
