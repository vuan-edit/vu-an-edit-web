@echo off
title Vu An Edit - Hybrid Server Launcher
set "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%"

echo ==========================================
echo    HE THONG HYBRID SERVER - VU AN EDIT
echo ==========================================
echo.

echo [1/3] Dang khoi chay Backend (Port 3000)...
start "Vu An Backend" cmd /k "node server/index.js"

echo [2/3] Dang khoi chay Frontend (Port 5173)...
start "Vu An Frontend" cmd /k "npm run dev"

echo [3/3] Dang khoi chay Cloudflare Tunnel (api.vuanedit.online)...
:: Cho 3 giay de server khoi dong truoc khi mo tunnel
timeout /t 3 /nobreak > nul
start "Cloudflare Tunnel" cmd /k ".\cloudflared.exe tunnel run vuanedit-local-server"

echo.
echo ------------------------------------------
echo TAT CA SERVER DANG DUOC BAT!
echo.
echo - Web Local: http://localhost:5173
echo - Web Live:  https://vuanedit.online
echo - API/Tunnel: https://api.vuanedit.online
echo ------------------------------------------
echo.
echo Luu y: Vui long KHONG dong cac cua so Terminal moi hien ra.
echo An phim bat ky de ket thuc trinh khoi chay.
pause > nul
