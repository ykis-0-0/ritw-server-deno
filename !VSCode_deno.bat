@echo off
SETLOCAL

SET DENO_DIR=%~dp0

PATH %PATH%;%DENO_DIR%
SET DENO_DIR=%DENO_DIR%\deno_modules

START %~dp0\..\VSCode-win32-x64\Code.exe