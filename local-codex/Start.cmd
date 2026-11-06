@echo off
cd /d "%~dp0"
echo Starting AlgoDojo Codex. Keep this window open while asking questions.
node "%~dp0bridge.mjs"
if errorlevel 1 pause
