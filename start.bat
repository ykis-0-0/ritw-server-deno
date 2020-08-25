@echo off
SETLOCAL
SET DENO_DIR=%~dp0\deno_modules
%~dp0\deno.exe %*
IF NOT "%VSCODE%"=="VSCODE" PAUSE > NUL