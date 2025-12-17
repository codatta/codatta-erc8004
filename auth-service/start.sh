#!/bin/bash

# Feedback Auth Service Startup Script

echo "🚀 Starting Feedback Authorization Service..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please create .env file:"
    echo "  cp .env.example .env"
    echo "  # Edit .env and fill in your values"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Start service
echo -e "${GREEN}✅ Starting service...${NC}"
npm run dev

