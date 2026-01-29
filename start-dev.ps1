# Kill any process using port 3005
$port = 3005
$processes = netstat -ano | findstr ":$port"

if ($processes) {
    Write-Host "Found processes using port $port. Killing them..." -ForegroundColor Yellow
    
    $processes | ForEach-Object {
        $line = $_.Trim()
        if ($line -match '\s+(\d+)\s*$') {
            $pid = $matches[1]
            Write-Host "Killing process $pid..." -ForegroundColor Red
            taskkill /F /PID $pid 2>$null
        }
    }
    
    Start-Sleep -Seconds 1
    Write-Host "Port $port is now free!" -ForegroundColor Green
} else {
    Write-Host "Port $port is already free." -ForegroundColor Green
}

# Start the dev server
Write-Host "`nStarting dev server..." -ForegroundColor Cyan
npm run dev
