@echo off
echo ========================================
echo 🚀 STARTING AUTONOMOUS DEPLOYMENT AGENT
echo ========================================

echo.
echo 📋 Project Components:
echo   - Next.js Frontend (Port 3000)
echo   - Kestra Workflow Engine (Port 8085)
echo   - AI-Powered Error Recovery System
echo.

echo 🔍 Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker not found! Please install Docker Desktop first.
    echo    Download: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker is available

echo.
echo 🐳 Starting Kestra Workflow Engine...
start "Kestra Server" cmd /k "docker-compose up"

echo.
echo ⏳ Waiting for Kestra to initialize (15 seconds)...
timeout /t 15 /nobreak >nul

echo.
echo 🌐 Starting Next.js Frontend...
start "Next.js Dev Server" cmd /k "npm run dev"

echo.
echo ========================================
echo ✅ PROJECT STARTED SUCCESSFULLY!
echo ========================================
echo.
echo 🌐 Access Points:
echo   • Frontend Dashboard: http://localhost:3000
echo   • Kestra Workflow UI: http://localhost:8085
echo.
echo 🔧 To test the AI recovery system:
echo   1. Open Kestra UI at http://localhost:8085
echo   2. Import the main-flow.yaml workflow
echo   3. Trigger with test error data
echo.
echo Press any key to open the frontend...
pause >nul
start http://localhost:3000