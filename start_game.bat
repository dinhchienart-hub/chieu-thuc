@echo off
title Vo Lam Idle - Offline Edition
echo =======================================================
echo          VO LAM IDLE - PHIEN BAN OFFLINE
echo =======================================================
echo.
echo [1] Dang mo game tren trinh duyet mac dinh...
start "" "http://localhost:8080/"
echo [2] Dang chay server tai http://localhost:8080/
echo.
echo Luu y: Giu cua so nay mo khi choi game. Dong cua so de tat game.
echo.
node server.mjs
pause
