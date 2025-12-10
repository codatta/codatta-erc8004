#!/bin/bash

# DID Ecosystem Services Startup Script
# This script starts all three services in the background

echo "🚀 Starting DID Ecosystem Services..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Check if required services are already running
if check_port 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 is already in use (Updater)${NC}"
fi

if check_port 3002; then
    echo -e "${YELLOW}⚠️  Port 3002 is already in use (Resolver)${NC}"
fi

if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use (DID Portal)${NC}"
fi

echo ""

# Check if config files exist
echo "📝 Checking configuration files..."

if [ ! -f "updater/config/default.json" ]; then
    echo -e "${RED}❌ updater/config/default.json not found!${NC}"
    echo "   Please copy updater/config/default.example.json to default.json and configure it."
    exit 1
fi

if [ ! -f "resolver/config/default.json" ]; then
    echo -e "${RED}❌ resolver/config/default.json not found!${NC}"
    echo "   Please copy resolver/config/default.example.json to default.json and configure it."
    exit 1
fi

echo -e "${GREEN}✓ Configuration files found${NC}"
echo ""

# Create logs directory
mkdir -p logs

# Start Updater Service
echo "1️⃣  Starting Updater Service (port 3001)..."
cd updater
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi
npm run dev > ../logs/updater.log 2>&1 &
UPDATER_PID=$!
cd ..
echo -e "${GREEN}   ✓ Updater started (PID: $UPDATER_PID)${NC}"
sleep 2

# Start Resolver Service
echo "2️⃣  Starting Resolver Service (port 3002)..."
cd resolver
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi
npm run dev > ../logs/resolver.log 2>&1 &
RESOLVER_PID=$!
cd ..
echo -e "${GREEN}   ✓ Resolver started (PID: $RESOLVER_PID)${NC}"
sleep 2

# Start DID Portal
echo "3️⃣  Starting DID Portal (port 3000)..."
cd did-portal
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi
npm run dev > ../logs/portal.log 2>&1 &
PORTAL_PID=$!
cd ..
echo -e "${GREEN}   ✓ DID Portal started (PID: $PORTAL_PID)${NC}"
sleep 3

echo ""
echo -e "${GREEN}✅ All services started successfully!${NC}"
echo ""
echo "📊 Service Status:"
echo "   • Updater:    http://localhost:3001 (PID: $UPDATER_PID)"
echo "   • Resolver:   http://localhost:3002 (PID: $RESOLVER_PID)"
echo "   • DID Portal: http://localhost:3000 (PID: $PORTAL_PID)"
echo ""
echo "📁 Logs are available in the logs/ directory"
echo ""
echo "To stop all services, run: ./stop-services.sh"
echo "Or kill processes manually: kill $UPDATER_PID $RESOLVER_PID $PORTAL_PID"
echo ""

# Save PIDs to file for easy stopping
echo "$UPDATER_PID" > logs/updater.pid
echo "$RESOLVER_PID" > logs/resolver.pid
echo "$PORTAL_PID" > logs/portal.pid

echo -e "${GREEN}🎉 Ready to use! Open http://localhost:3000 in your browser${NC}"

