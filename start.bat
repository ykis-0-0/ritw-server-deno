@echo off
SETLOCAL
SET DENO_DIR=%~dp0\deno_modules
IF "%VSCODE%"=="VSCODE" (
  START %~dp0\deno.exe %*
) ELSE (
  %~dp0\deno.exe %*
  PAUSE > NUL
)