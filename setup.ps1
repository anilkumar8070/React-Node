# Student Activity Record Platform - Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Student Activity Platform Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js $nodeVersion is installed" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed
Write-Host "Checking MongoDB installation..." -ForegroundColor Yellow
$mongoVersion = mongod --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ MongoDB is installed" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB is not detected. You can use MongoDB Atlas instead." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install server dependencies
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
Set-Location ..

# Install client dependencies
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Make sure MongoDB is running (or configure MongoDB Atlas)" -ForegroundColor White
Write-Host "2. Check environment files:" -ForegroundColor White
Write-Host "   - server/.env" -ForegroundColor White
Write-Host "   - client/.env" -ForegroundColor White
Write-Host ""
Write-Host "3. Start the application:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Or start separately:" -ForegroundColor White
Write-Host "   - Backend:  cd server && npm run dev" -ForegroundColor Cyan
Write-Host "   - Frontend: cd client && npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Access the application:" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Read QUICKSTART.md for detailed instructions!" -ForegroundColor Yellow
Write-Host ""
