@echo off
setlocal enabledelayedexpansion

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found on PATH. Please install Node.js from https://nodejs.org/ and reopen this window.
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed. See the log above for details.
    exit /b !errorlevel!
  )
) else (
  echo Dependencies already installed - skipping npm install.
)

echo Creating production build for Windows distribution...
call npm run build
if errorlevel 1 (
  echo Build failed.
  exit /b !errorlevel!
)

echo Build complete. Optimized assets are available in the dist directory.
exit /b 0
