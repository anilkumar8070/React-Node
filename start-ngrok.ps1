# Start ngrok and update configuration
Write-Host "🚀 Starting ngrok tunnel on port 3000..." -ForegroundColor Cyan
Write-Host ""

# Start ngrok in background and capture output
$ngrokJob = Start-Job -ScriptBlock {
    ngrok http 3000 --log=stdout
}

# Wait a bit for ngrok to start
Start-Sleep -Seconds 3

# Get ngrok URL from API
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    $publicUrl = $ngrokApi.tunnels[0].public_url
    
    if ($publicUrl) {
        Write-Host "✅ Ngrok tunnel created!" -ForegroundColor Green
        Write-Host "📱 Your ngrok URL: $publicUrl" -ForegroundColor Yellow
        Write-Host ""
        
        # Update server/.env
        $serverEnvPath = "server\.env"
        $serverEnvContent = Get-Content $serverEnvPath -Raw
        
        if ($serverEnvContent -match "CLIENT_URL=.*") {
            $serverEnvContent = $serverEnvContent -replace "CLIENT_URL=.*", "CLIENT_URL=$publicUrl"
        } else {
            $serverEnvContent += "`nCLIENT_URL=$publicUrl"
        }
        
        Set-Content -Path $serverEnvPath -Value $serverEnvContent
        Write-Host "✅ Updated server/.env with CLIENT_URL=$publicUrl" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Restart your dev server: npm run dev" -ForegroundColor White
        Write-Host "2. Open on your phone: $publicUrl" -ForegroundColor White
        Write-Host ""
        Write-Host "⚠️  Keep this window open! Closing it will stop ngrok." -ForegroundColor Red
        Write-Host ""
        
        # Keep showing ngrok logs
        Receive-Job -Job $ngrokJob -Wait
    }
} catch {
    Write-Host "❌ Could not connect to ngrok API. Make sure ngrok is installed." -ForegroundColor Red
    Write-Host "Install ngrok from: https://ngrok.com/download" -ForegroundColor Yellow
}
