@echo off
title Vu An Edit - Launcher
echo ==========================================
echo    KHOI CHAY DU AN VU AN EDIT (LOCAL)
echo ==========================================
echo.

echo [1/2] Dang khoi chay Backend (Port 3000)...
start "Vu An Edit - Backend" cmd /k "cd server && node index.js"

echo [2/3] Dang khoi chay Frontend (Port 5173)...
start "Vu An Edit - Frontend" cmd /k "npm run dev"

echo [3/3] Dang khoi chay Cloudflare Tunnel (api.vuanedit.online)...
start "Vu An Edit - Tunnel" cmd /k "cd server && ^"C:\Program Files (x86)\cloudflared\cloudflared.exe^" tunnel run vuanedit-local-server"

echo.
echo ------------------------------------------
echo Tat ca server dang duoc bat!
echo - Website: http://localhost:5173
echo - API/Storage: http://localhost:3000
echo ------------------------------------------
echo An phim bat ky de dong cua so nay (Server van se chay).
pause > nul
