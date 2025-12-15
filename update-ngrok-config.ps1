# Ngrok Configuration Update Script
# Run this after starting your ngrok tunnels

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$FrontendUrl
)

Write-Host "Updating configuration files..." -ForegroundColor Cyan

# Update client/.env
$clientEnvPath = "client\.env"
$clientEnvContent = @"
VITE_API_URL=$BackendUrl/api
VITE_SOCKET_URL=$BackendUrl
"@

Set-Content -Path $clientEnvPath -Value $clientEnvContent
Write-Host "✅ Updated client/.env" -ForegroundColor Green

# Update server/.env
$serverEnvPath = "server\.env"
$serverEnvContent = Get-Content $serverEnvPath -Raw

# Replace or add CLIENT_URL
if ($serverEnvContent -match "CLIENT_URL=.*") {
    $serverEnvContent = $serverEnvContent -replace "CLIENT_URL=.*", "CLIENT_URL=$FrontendUrl"
} else {
    $serverEnvContent += "`nCLIENT_URL=$FrontendUrl"
}

Set-Content -Path $serverEnvPath -Value $serverEnvContent
Write-Host "✅ Updated server/.env" -ForegroundColor Green

Write-Host "`n📝 Configuration Summary:" -ForegroundColor Yellow
Write-Host "Backend URL: $BackendUrl" -ForegroundColor White
Write-Host "Frontend URL: $FrontendUrl" -ForegroundColor White
Write-Host "`n⚠️  Please restart your development server (npm run dev) for changes to take effect!" -ForegroundColor Red
Write-Host "`n📱 Access your app on phone at: $FrontendUrl" -ForegroundColor Green
