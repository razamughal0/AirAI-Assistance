# Air University Knowledge Assistant — Windows one-time setup helper
# Run this from PowerShell inside the project folder:
#   powershell -ExecutionPolicy Bypass -File scripts\setup-windows.ps1
#
# What it does:
#   1. Creates a '.env' file if one is missing (common when a project is
#      downloaded as a ZIP, since some tools skip dotfiles).
#   2. Installs npm dependencies.
#   3. Pushes the database schema to PostgreSQL (requires PostgreSQL running).
#
# It does NOT install Node.js or PostgreSQL for you — see README.md
# "Run locally on Windows" for links if you don't have them yet.

$ErrorActionPreference = "Stop"

Write-Host "== Air University Knowledge Assistant — Windows setup ==" -ForegroundColor Cyan

$envPath = Join-Path $PSScriptRoot "..\.env"
$envExamplePath = Join-Path $PSScriptRoot "..\.env.example"

if (-not (Test-Path $envPath)) {
    Write-Host "No .env file found — creating one with local defaults..." -ForegroundColor Yellow
    if (Test-Path $envExamplePath) {
        Copy-Item $envExamplePath $envPath
    } else {
        Set-Content -Path $envPath -Value "DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db`nADMIN_PASSWORD=au-knowledge-admin`n"
    }
    Write-Host ".env created at $envPath" -ForegroundColor Green
    Write-Host "If your PostgreSQL username/password/database differ, edit .env now before continuing." -ForegroundColor Yellow
} else {
    Write-Host ".env already exists — leaving it untouched." -ForegroundColor Green
}

Write-Host "`nInstalling npm dependencies (this can take a few minutes)..." -ForegroundColor Cyan
npm install

Write-Host "`nChecking PostgreSQL connectivity and applying the database schema..." -ForegroundColor Cyan
try {
    npx drizzle-kit push
    Write-Host "`nDatabase schema is up to date." -ForegroundColor Green
} catch {
    Write-Host "`nCould not reach PostgreSQL. Make sure it is installed and running, and that DATABASE_URL in .env is correct." -ForegroundColor Red
    Write-Host "See README.md -> 'Run locally on Windows' for step-by-step PostgreSQL setup." -ForegroundColor Red
    exit 1
}

Write-Host "`nSetup complete. Start the app with:  npm run dev" -ForegroundColor Cyan
