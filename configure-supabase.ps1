# Automated Supabase Configuration Script
# Run this from: C:\FINAL-WEBSYSTEM directory
# Command: .\configure-supabase.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Supabase Configuration Automation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Your provided credentials
$projectRef = "kfjljerbuieggbgxrgww"
$projectUrl = "https://kfjljerbuieggbgxrgww.supabase.co"
$dbPassword = 'YK%qQ5V2#d9sHZ@'
$dbUsername = "postgres.kfjljerbuieggbgxrgww"
$anonKey = "sb_publishable_fU-o6_5--bwgYAsV7ETw0J6Qz"
$serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmamxqZXJidWllZ2diZ3hyZ3d3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyODQ0OSwiZXhwIjoyMDkwMzA0NDQ5fQ.xvLokmko4uQBHZtiWrnra-DZft4Ov4CAxc880XujIbk"

# Step 1: Get Pooler Host
Write-Host "📍 Step 1: Database Host Configuration" -ForegroundColor Yellow
Write-Host ""
Write-Host "You need to find your Pooler Host from Supabase:" -ForegroundColor White
Write-Host "  1. Go to: https://app.supabase.com" -ForegroundColor Gray
Write-Host "  2. Select your project: $projectRef" -ForegroundColor Gray
Write-Host "  3. Go to: Settings > Database" -ForegroundColor Gray
Write-Host "  4. Copy the 'Host' (Pooler)" -ForegroundColor Gray
Write-Host "  5. It should look like: aws-0-xx-yyyy.pooler.supabase.com" -ForegroundColor Gray
Write-Host ""

$dbHost = Read-Host "Enter your Pooler Host (or press Enter to use default pattern)"

if ([string]::IsNullOrWhiteSpace($dbHost)) {
    # Attempt to auto-detect based on common pattern
    Write-Host "⚠️  Using fallback pattern. This may not work - please get exact host from Supabase." -ForegroundColor Yellow
    $dbHost = "aws-0-us-east-1.pooler.supabase.com"  # Common default, but user should verify
}

Write-Host "✓ Pooler Host: $dbHost" -ForegroundColor Green
Write-Host ""

# Step 2: Verify backend directory exists
Write-Host "📁 Step 2: Verifying Backend Directory" -ForegroundColor Yellow
if (-Not (Test-Path "backend")) {
    Write-Host "❌ Error: 'backend' directory not found in current location" -ForegroundColor Red
    Write-Host "   Current location: $(Get-Location)" -ForegroundColor Gray
    exit 1
}
Write-Host "✓ Backend directory found" -ForegroundColor Green
Write-Host ""

# Step 3: Create/Update backend/.env
Write-Host "⚙️  Step 3: Updating backend/.env" -ForegroundColor Yellow

$envContent = @"
APP_NAME="PhotoStudio Booking"
APP_ENV=local
APP_KEY=base64:YOUR_APP_KEY
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=$dbHost
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=$dbUsername
DB_PASSWORD=$dbPassword

SUPABASE_URL=$projectUrl
SUPABASE_ANON_KEY=$anonKey
SUPABASE_SERVICE_ROLE_KEY=$serviceRoleKey

LOG_CHANNEL=stack
LOG_LEVEL=debug
CACHE_STORE=database
SESSION_DRIVER=database
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
"@

$envPath = "backend\.env"
Set-Content -Path $envPath -Value $envContent
Write-Host "✓ Created/Updated: backend\.env" -ForegroundColor Green
Write-Host ""

# Step 4: Verify frontend directory
Write-Host "📁 Step 4: Verifying Frontend Directory" -ForegroundColor Yellow
if (-Not (Test-Path "frontend")) {
    Write-Host "❌ Error: 'frontend' directory not found" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend directory found" -ForegroundColor Green
Write-Host ""

# Step 5: Create/Update frontend/.env
Write-Host "⚙️  Step 5: Updating frontend/.env" -ForegroundColor Yellow

$frontendEnvContent = @"
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=$projectUrl
VITE_SUPABASE_ANON_KEY=$anonKey
"@

$frontendEnvPath = "frontend\.env"
Set-Content -Path $frontendEnvPath -Value $frontendEnvContent
Write-Host "✓ Created/Updated: frontend\.env" -ForegroundColor Green
Write-Host ""

# Step 6: Test PHP is available
Write-Host "🔍 Step 6: Verifying PHP Installation" -ForegroundColor Yellow
$phpVersion = & php --version 2>$null
if ($null -eq $phpVersion) {
    Write-Host "⚠️  PHP not found in PATH" -ForegroundColor Yellow
    Write-Host "   Skipping connection test - run manually:" -ForegroundColor Gray
    Write-Host "   cd backend && php artisan supabase:test" -ForegroundColor Gray
} else {
    Write-Host "✓ PHP found: $($phpVersion[0])" -ForegroundColor Green
}
Write-Host ""

# Step 7: Generate App Key
Write-Host "🔐 Step 7: Generating App Key" -ForegroundColor Yellow
Push-Location backend
if ((Test-Path ".env") -and (Select-String -Path ".env" -Pattern "APP_KEY=base64:" -Quiet)) {
    $appKey = & php artisan key:generate --show 2>$null
    if ($appKey) {
        $envContent = Get-Content ".env"
        $envContent = $envContent -replace "APP_KEY=base64:YOUR_APP_KEY", "APP_KEY=$appKey"
        Set-Content -Path ".env" -Value $envContent
        Write-Host "✓ App key generated" -ForegroundColor Green
    }
}
Pop-Location
Write-Host ""

# Step 8: Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuration Complete! ✅" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Summary of Configuration:" -ForegroundColor Yellow
Write-Host "  Database Host: $dbHost" -ForegroundColor White
Write-Host "  Database Port: 6543" -ForegroundColor White
Write-Host "  Database Name: postgres" -ForegroundColor White
Write-Host "  Database User: $dbUsername" -ForegroundColor White
Write-Host "  Project URL: $projectUrl" -ForegroundColor White
Write-Host ""

Write-Host "📁 Files Updated:" -ForegroundColor Yellow
Write-Host "  ✓ backend\.env" -ForegroundColor Green
Write-Host "  ✓ frontend\.env" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Open Terminal 1:" -ForegroundColor White
Write-Host "     cd backend" -ForegroundColor Gray
Write-Host "     php artisan supabase:test" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. If test passes, run migrations:" -ForegroundColor White
Write-Host "     php artisan migrate" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Start backend (Terminal 1):" -ForegroundColor White
Write-Host "     php artisan serve" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Start frontend (Terminal 2):" -ForegroundColor White
Write-Host "     cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  5. Open browser:" -ForegroundColor White
Write-Host "     http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔑 Test Credentials:" -ForegroundColor Yellow
Write-Host "  Admin:" -ForegroundColor White
Write-Host "    Email: admin@studio.com" -ForegroundColor Gray
Write-Host "    Pass: password" -ForegroundColor Gray
Write-Host ""
Write-Host "  Client:" -ForegroundColor White
Write-Host "    Email: client@studio.com" -ForegroundColor Gray
Write-Host "    Pass: password" -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  Important Notes:" -ForegroundColor Yellow
Write-Host "  • Verify the Pooler Host is correct from Supabase Settings" -ForegroundColor White
Write-Host "  • Never commit .env files to Git (they're in .gitignore)" -ForegroundColor White
Write-Host "  • If connection fails, check database host in .env" -ForegroundColor White
Write-Host ""
