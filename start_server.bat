@echo off
cd /d "%~dp0"
echo Starting local web server for "I Don't Know What to Eat"...
:: Start python's built-in HTTP server on port 8000 minimized
start /min python -m http.server 8000
:: Wait 1 second to let the port initialize
timeout /t 1 /nobreak >nul
:: Open default browser to the server URL
start http://localhost:8000
exit
