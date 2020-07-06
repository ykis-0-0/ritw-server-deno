@echo off
SETLOCAL
SET DENO_DIR=%~dp0\deno_modules
%~dp0\deno.exe run -A --importmap=./importmap.json --unstable .\src\index.ts
IF NOT "%VSCODE%"=="VSCODE" (
PAUSE > NUL
)