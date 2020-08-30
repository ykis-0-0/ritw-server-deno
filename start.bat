@echo off
SETLOCAL
SET DENO_DIR=%~dp0\deno_modules
%~dp0\deno.exe %*
IF "%VSCODE%"=="VSCODE" EXIT
ECHO Stopped.
PAUSE > NUL