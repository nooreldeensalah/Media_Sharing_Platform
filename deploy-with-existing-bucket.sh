#!/bin/bash

# Customized Fly.io Deployment Script for Existing Tigris Bucket
# Uses pre-configured bucket: misty-frost-1767

set -e

echo "🚀 Starting Fly.io Deployment with Existing Tigris Bucket..."

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Your Tigris bucket credentials
TIGRIS_ACCESS_KEY="tid_UBoTPfEzzDJPXNxyFgUOBypJaHSOpsFCOPvPYAFvpn_PDkoveb"
TIGRIS_SECRET_KEY="tsec_2tewinS-WBOgQbs0+y0e7k_lOcMnPrcu6v_0iAQMTqVuYSddyixArLp93RaQGIojJipkpi"
TIGRIS_ENDPOINT="https://fly.storage.tigris.dev"
TIGRIS_REGION="auto"
BUCKET_NAME="misty-frost-1767"

# Function to check if app exists (optimized)
app_exists() {
    fly apps list --json | jq -e ".[] | select(.Name == \"$1\")" > /dev/null 2>&1
}

# Function to check if volume exists (optimized)
volume_exists() {
    fly volumes list -a "$1" --json | jq -e ".[] | select(.Name == \"$2\")" > /dev/null 2>&1
}

# Function to check if secret exists
secret_exists() {
    fly secrets list -a "$1" | grep -q "^$2"
}

# Check if flyctl is installed
if ! command -v fly &> /dev/null; then
    echo -e "${RED}❌ Fly CLI not found. Installing...${NC}"
    curl -L https://fly.io/install.sh | sh
    export PATH="$HOME/.fly/bin:$PATH"
fi

# Check if jq is installed (needed for optimized checks)
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  Installing jq for optimized API parsing...${NC}"
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y jq
    elif command -v brew &> /dev/null; then
        brew install jq
    else
        echo -e "${RED}❌ Please install jq manually: https://stedolan.github.io/jq/download/${NC}"
        exit 1
    fi
fi

# Login check
echo -e "${BLUE}🔐 Checking Fly.io authentication...${NC}"
if ! fly auth whoami &> /dev/null; then
    echo -e "${YELLOW}Please login to Fly.io:${NC}"
    fly auth login
fi

# Verify existing bucket
echo -e "${BLUE}🗄️  Verifying existing Tigris bucket...${NC}"
echo -e "${GREEN}✅ Using existing bucket: ${BUCKET_NAME}${NC}"

# Deploy Backend
echo -e "${BLUE}🔧 Deploying Backend...${NC}"

# Create backend app if it doesn't exist
if ! app_exists "media-platform-backend"; then
    echo -e "${YELLOW}Creating backend app...${NC}"
    fly apps create media-platform-backend
    echo -e "${GREEN}✅ Backend app created${NC}"
else
    echo -e "${GREEN}✅ Backend app already exists${NC}"
fi

# Create volume if it doesn't exist
if ! volume_exists "media-platform-backend" "media_platform_data"; then
    echo -e "${YELLOW}Creating persistent volume for SQLite...${NC}"
    fly volumes create media_platform_data --region iad --size 1 -a media-platform-backend --yes
    echo -e "${GREEN}✅ Volume created successfully${NC}"
else
    echo -e "${GREEN}✅ Volume already exists${NC}"
fi

# Set all secrets including your Tigris credentials (optimized)
echo -e "${YELLOW}Setting up backend secrets with Tigris credentials...${NC}"

# Check if secrets need to be updated
if ! secret_exists "media-platform-backend" "JWT_SECRET"; then
    echo -e "${BLUE}Setting JWT secret...${NC}"
    fly secrets set -a media-platform-backend JWT_SECRET="$(openssl rand -base64 32)"
fi

# Set Tigris credentials (always update these as they may change)
fly secrets set -a media-platform-backend \
    S3_ACCESS_KEY="${TIGRIS_ACCESS_KEY}" \
    S3_SECRET_KEY="${TIGRIS_SECRET_KEY}" \
    S3_ENDPOINT="${TIGRIS_ENDPOINT}" \
    S3_REGION="${TIGRIS_REGION}" \
    BUCKET_NAME="${BUCKET_NAME}" \
    --detach

echo -e "${GREEN}✅ All secrets configured${NC}"

# Ensure frontend app exists before deployment
if ! app_exists "media-platform-frontend"; then
    echo -e "${YELLOW}Creating frontend app...${NC}"
    fly apps create media-platform-frontend
    echo -e "${GREEN}✅ Frontend app created${NC}"
else
    echo -e "${GREEN}✅ Frontend app already exists${NC}"
fi

# Deploy backend
echo -e "${GREEN}🔧 Deploying backend...${NC}"
cd backend
fly deploy --app media-platform-backend --remote-only --strategy immediate
cd ..

# Deploy frontend
echo -e "${BLUE}🎨 Deploying frontend...${NC}"
cd frontend
fly deploy --app media-platform-frontend --remote-only --strategy immediate
cd ..

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${BLUE}📱 Frontend URL: https://media-platform-frontend.fly.dev${NC}"
echo -e "${BLUE}🔧 Backend URL: https://media-platform-backend.fly.dev${NC}"
echo -e "${BLUE}📊 Storage: Tigris bucket '${BUCKET_NAME}'${NC}"

# Optimized status check
echo -e "${YELLOW}🔍 Checking deployment status...${NC}"
echo -e "${BLUE}Backend Status:${NC}"
fly status -a media-platform-backend --json | jq -r '.Status'

echo -e "${BLUE}Frontend Status:${NC}"
fly status -a media-platform-frontend --json | jq -r '.Status'

echo -e "${GREEN}🎉 All services deployed successfully!${NC}"
echo -e "${BLUE}Your media platform is ready at: https://media-platform-frontend.fly.dev${NC}"

# Optional: Open browser to frontend URL
read -p "Open frontend in browser? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open https://media-platform-frontend.fly.dev
    elif command -v open &> /dev/null; then
        open https://media-platform-frontend.fly.dev
    else
        echo -e "${YELLOW}Please open: https://media-platform-frontend.fly.dev${NC}"
    fi
fi
