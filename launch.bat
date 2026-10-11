@echo off
title Shaik Ali Ahammad - Portfolio Launcher
echo ===================================================
echo  Starting Shaik Ali Ahammad Data Science Portfolio
echo ===================================================
echo.
echo Opening portfolio in your default browser...
start http://localhost:4173/
echo.
echo Running local server on http://localhost:4173 ...
call npm.cmd run preview -- --port 4173
pause
