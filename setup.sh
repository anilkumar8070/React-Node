#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================"
echo -e "Student Activity Platform Setup"
echo -e "========================================${NC}"
echo ""

# Check if Node.js is installed
echo -e "${YELLOW}Checking Node.js installation...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION is installed${NC}"
else
    echo -e "${RED}✗ Node.js is not installed. Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Check if MongoDB is installed
echo -e "${YELLOW}Checking MongoDB installation...${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB is installed${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB is not detected. You can use MongoDB Atlas instead.${NC}"
fi

echo ""
echo -e "${CYAN}========================================"
echo -e "Installing Dependencies"
echo -e "========================================${NC}"
echo ""

# Install root dependencies
echo -e "${YELLOW}Installing root dependencies...${NC}"
npm install

# Install server dependencies
echo -e "${YELLOW}Installing server dependencies...${NC}"
cd server
npm install
cd ..

# Install client dependencies
echo -e "${YELLOW}Installing client dependencies...${NC}"
cd client
npm install
cd ..

echo ""
echo -e "${CYAN}========================================"
echo -e "${GREEN}Setup Complete!"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "${NC}1. Make sure MongoDB is running (or configure MongoDB Atlas)"
echo -e "2. Check environment files:"
echo -e "   - server/.env"
echo -e "   - client/.env"
echo ""
echo -e "3. Start the application:"
echo -e "   ${CYAN}npm run dev${NC}"
echo ""
echo -e "   Or start separately:"
echo -e "   - Backend:  ${CYAN}cd server && npm run dev${NC}"
echo -e "   - Frontend: ${CYAN}cd client && npm run dev${NC}"
echo ""
echo -e "4. Access the application:"
echo -e "   - Frontend: ${CYAN}http://localhost:3000${NC}"
echo -e "   - Backend:  ${CYAN}http://localhost:5000${NC}"
echo ""
echo -e "${YELLOW}Read QUICKSTART.md for detailed instructions!${NC}"
echo ""
