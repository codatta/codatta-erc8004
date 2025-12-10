#!/bin/bash

# DID Ecosystem Services Stop Script
# This script stops all running services

echo "🛑 Stopping DID Ecosystem Services..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if PID files exist
if [ ! -d "logs" ]; then
    echo -e "${YELLOW}No logs directory found. Services may not be running.${NC}"
    exit 0
fi

# Stop Updater
if [ -f "logs/updater.pid" ]; then
    UPDATER_PID=$(cat logs/updater.pid)
    if ps -p $UPDATER_PID > /dev/null 2>&1; then
        kill $UPDATER_PID
        echo -e "${GREEN}✓ Stopped Updater (PID: $UPDATER_PID)${NC}"
    else
        echo -e "${YELLOW}⚠️  Updater process not found${NC}"
    fi
    rm logs/updater.pid
fi

# Stop Resolver
if [ -f "logs/resolver.pid" ]; then
    RESOLVER_PID=$(cat logs/resolver.pid)
    if ps -p $RESOLVER_PID > /dev/null 2>&1; then
        kill $RESOLVER_PID
        echo -e "${GREEN}✓ Stopped Resolver (PID: $RESOLVER_PID)${NC}"
    else
        echo -e "${YELLOW}⚠️  Resolver process not found${NC}"
    fi
    rm logs/resolver.pid
fi

# Stop DID Portal
if [ -f "logs/portal.pid" ]; then
    PORTAL_PID=$(cat logs/portal.pid)
    if ps -p $PORTAL_PID > /dev/null 2>&1; then
        kill $PORTAL_PID
        echo -e "${GREEN}✓ Stopped DID Portal (PID: $PORTAL_PID)${NC}"
    else
        echo -e "${YELLOW}⚠️  DID Portal process not found${NC}"
    fi
    rm logs/portal.pid
fi

# Also kill any remaining node processes on these ports
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3002 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

echo ""
echo -e "${GREEN}✅ All services stopped${NC}"

