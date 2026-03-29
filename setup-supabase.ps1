#!/usr/bin/env pwsh
# PhotoStudio Booking System - Supabase Setup Script
# Requires: PowerShell 5.1+, PHP, Composer, Node.js, npm

Write-Host "`n🚀 PhotoStudio Supabase Setup Script`n" -ForegroundColor Cyan

# Check prerequisites
Write-Host "✓ Checking prerequisites..." -ForegroundColor Yellow

$requirements = @(
    @{ Name = "PHP"; Command = "php --version" },
    @{ Name = "Composer"; Command = "composer --version" },
    @{ Name = "Node.js"; Command = "node --version" },
    @{ Name = "npm"; Command = "npm --version" }
)

foreach ($req in $requirements) {
    try {
        $null = & $req.Command 2>&1
        Write-Host "  ✅ $($req.Name) found" -ForegroundColor Green
    }
    catch {
        Write-Host "  ❌ $($req.Name) NOT found" -ForegroundColor Red
        Write-Host "     Please install $($req.Name) and try again`n" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "`n📋 Setup Steps:`n" -ForegroundColor Cyan

# Step 1: Get Supabase credentials
Write-Host "1️⃣  Enter your Supabase credentials`n" -ForegroundColor Yellow

$host = Read-Host "   DB_HOST (e.g., aws-0-eu-central-1.pooler.supabase.com)"
$port = Read-Host "   DB_PORT (default: 6543)" -Default "6543"
$database = Read-Host "   DB_DATABASE (default: postgres)" -Default "postgres"
$username = Read-Host "   DB_USERNAME (e.g., postgres.abcdefg)"
$password = Read-Host "   DB_PASSWORD" -AsSecureString
$password_plain = [System.Net.NetworkCredential]::new("", $password).Password

# Step 2: Update backend .env
Write-Host "`n2️⃣  Updating backend/.env..." -ForegroundColor Yellow

$envPath = ".\backend\.env"

if (-not (Test-Path $envPath)) {
    Write-Host "   ⚠️  .env not found, copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".\backend\.env.example" $envPath
}

Write-Host "   Updating database credentials..." -ForegroundColor Gray

# Read current .env
$envContent = Get-Content $envPath -Raw

# Replace database configuration
$envContent = $envContent -replace 'DB_HOST=.*', "DB_HOST=$host"
$envContent = $envContent -replace 'DB_PORT=.*', "DB_PORT=$port"
$envContent = $envContent -replace 'DB_DATABASE=.*', "DB_DATABASE=$database"
$envContent = $envContent -replace 'DB_USERNAME=.*', "DB_USERNAME=$username"
$envContent = $envContent -replace 'DB_PASSWORD=.*', "DB_PASSWORD=$password_plain"
$envContent = $envContent -replace 'DB_CONNECTION=.*', "DB_CONNECTION=pgsql"

# Write back to .env
Set-Content $envPath $envContent

Write-Host "   ✅ Backend .env updated" -ForegroundColor Green

# Step 3: Generate app key if needed
Write-Host "`n3️⃣  Setting up Laravel..." -ForegroundColor Yellow

Set-Location .\backend

# Check if APP_KEY is set
if ((grep "APP_KEY=" .env) -like "*APP_KEY=*") {
    Write-Host "   ✓ APP_KEY already set" -ForegroundColor Gray
} else {
    Write-Host "   Generating APP_KEY..." -ForegroundColor Gray
    php artisan key:generate
}

# Step 4: Test database connection
Write-Host "`n4️⃣  Testing Supabase connection..." -ForegroundColor Yellow

$testOutput = php artisan supabase:test 2>&1

if ($testOutput -like "*SUCCESS*") {
    Write-Host "   ✅ Connection successful!" -ForegroundColor Green
    Write-Host $testOutput -ForegroundColor Gray
} else {
    Write-Host "   ❌ Connection failed!" -ForegroundColor Red
    Write-Host $testOutput -ForegroundColor Gray
    Write-Host "`n   Please verify your credentials and try again." -ForegroundColor Yellow
    Set-Location ..
    exit 1
}

# Step 5: Run migrations
Write-Host "`n5️⃣  Creating database tables..." -ForegroundColor Yellow
Write-Host "   Running migrations..." -ForegroundColor Gray

php artisan migrate --force

Write-Host "   ✅ Database tables created" -ForegroundColor Green

# Step 6: Go back and setup frontend
Set-Location ..

Write-Host "`n6️⃣  Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location .\frontend

npm install

Write-Host "   ✅ Dependencies installed" -ForegroundColor Green

Set-Location ..

# Done!
Write-Host "`n✨ Setup Complete!`n" -ForegroundColor Green

Write-Host "🚀 To start development:`n" -ForegroundColor Cyan

Write-Host "   Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   php artisan serve" -ForegroundColor Gray

Write-Host "`n   Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray

Write-Host "`n   Open: http://localhost:5173`n" -ForegroundColor Cyan

Write-Host "📝 Create test users in Laravel Tinker:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   php artisan tinker" -ForegroundColor Gray
Write-Host "   User::create(['name'=>'Admin','email'=>'admin@studio.com','password'=>Hash::make('password'),'role'=>'admin']);" -ForegroundColor Gray
Write-Host "   User::create(['name'=>'Client','email'=>'client@studio.com','password'=>Hash::make('password'),'role'=>'client']);" -ForegroundColor Gray

Write-Host "`n✅ Happy coding!`n" -ForegroundColor Green
