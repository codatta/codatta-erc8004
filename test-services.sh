#!/bin/bash

# DID Ecosystem Services Health Check Script
# This script tests if all services are running properly

echo "🏥 Health Check for DID Ecosystem Services"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to test HTTP endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ OK (HTTP $response)${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED (HTTP $response, expected $expected_status)${NC}"
        return 1
    fi
}

# Check if services are listening on ports
check_port() {
    local port=$1
    local service=$2
    
    if lsof -i:$port > /dev/null 2>&1; then
        echo -e "${GREEN}✓ $service is running on port $port${NC}"
        return 0
    else
        echo -e "${RED}✗ $service is NOT running on port $port${NC}"
        return 1
    fi
}

echo "1️⃣  Checking if services are running..."
echo ""

check_port 3001 "Updater"
updater_running=$?

check_port 3002 "Resolver"
resolver_running=$?

check_port 3000 "DID Portal"
portal_running=$?

echo ""
echo "2️⃣  Testing service endpoints..."
echo ""

# Test Resolver health endpoint
if [ $resolver_running -eq 0 ]; then
    test_endpoint "Resolver Health" "http://localhost:3002/health" 200
else
    echo -e "${YELLOW}⚠️  Skipping Resolver tests (service not running)${NC}"
fi

# Test Updater endpoint (should return 404 for GET on /document without ID)
if [ $updater_running -eq 0 ]; then
    echo -n "Testing Updater endpoint... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/document/test" 2>/dev/null)
    # Expecting 400 or 404 since we're using GET instead of PUT
    if [ "$response" -eq "404" ] || [ "$response" -eq "400" ]; then
        echo -e "${GREEN}✓ OK (Endpoint reachable)${NC}"
    else
        echo -e "${YELLOW}⚠️  Unexpected response (HTTP $response)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping Updater tests (service not running)${NC}"
fi

# Test DID Portal endpoint
if [ $portal_running -eq 0 ]; then
    test_endpoint "DID Portal" "http://localhost:3000" 200
else
    echo -e "${YELLOW}⚠️  Skipping DID Portal tests (service not running)${NC}"
fi

echo ""
echo "3️⃣  Testing Resolver resolve endpoint..."
echo ""

if [ $resolver_running -eq 0 ]; then
    # Test with a sample DID (should return 404 if not found, but endpoint should work)
    echo -n "Testing DID resolution... "
    response=$(curl -s "http://localhost:3002/resolve/did:example:123" 2>/dev/null)
    
    if echo "$response" | grep -q "error\|didDocument"; then
        echo -e "${GREEN}✓ OK (Endpoint working correctly)${NC}"
        echo "   Response preview: $(echo $response | head -c 100)..."
    else
        echo -e "${RED}✗ FAILED (Unexpected response)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping (Resolver not running)${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
if [ $updater_running -eq 0 ] && [ $resolver_running -eq 0 ] && [ $portal_running -eq 0 ]; then
    echo -e "${GREEN}✅ All services are running!${NC}"
    echo ""
    echo "Service URLs:"
    echo "  • Updater:    http://localhost:3001"
    echo "  • Resolver:   http://localhost:3002"
    echo "  • DID Portal: http://localhost:3000"
    echo ""
    echo "You can now use the DID Portal at http://localhost:3000"
else
    echo -e "${RED}❌ Some services are not running${NC}"
    echo ""
    echo "To start all services, run: ./start-services.sh"
fi

echo ""

