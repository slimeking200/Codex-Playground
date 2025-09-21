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

echo Starting Azure Depths development server...
call npm run dev
exit /b !errorlevel!
