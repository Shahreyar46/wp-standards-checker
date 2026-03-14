@echo off
:: ============================================================
::  WPSafeFix — One-liner installer for Windows
::  WordPress Coding Standards & Plugin Review Auditor
::  by MD. AL-Shahreyar (https://github.com/Shahreyar46)
::
::  Usage:
::    powershell -c "irm https://raw.githubusercontent.com/Shahreyar46/wp-standards/master/install.bat -OutFile install.bat; .\install.bat"
::
::  Or just run this file after downloading it.
:: ============================================================

setlocal EnableDelayedExpansion

set "REPO=https://github.com/Shahreyar46/wp-standards.git"
set "SKILL_NAME=wp-standards"
set "GLOBAL_DIR=%USERPROFILE%\.claude\skills\%SKILL_NAME%"
set "LOCAL_DIR=.claude\skills\%SKILL_NAME%"

echo.
echo  =======================================================
echo    WPSafeFix -- WordPress Auditor Skill
echo    Coding Standards ^& Plugin Review Toolkit
echo    by MD. AL-Shahreyar  *  github.com/Shahreyar46
echo  =======================================================
echo.

:: ── Check git ────────────────────────────────────────────────
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] git is not installed.
    echo  Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo  [OK] git found

:: ── Check Node.js ─────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not installed.
    echo  Download from: https://nodejs.org ^(v18 or higher^)
    pause
    exit /b 1
)
echo  [OK] Node.js found
echo.

:: ── Ask install type ──────────────────────────────────────────
echo  Where would you like to install the skill?
echo.
echo    [1] Global (recommended) -- available in ALL your projects
echo        Installs to: %GLOBAL_DIR%
echo.
echo    [2] Local -- only in the current project folder
echo        Installs to: %CD%\.claude\skills\%SKILL_NAME%
echo.
set /p "CHOICE= Enter choice [1/2] (default: 1): "
if "%CHOICE%"=="" set CHOICE=1

if "%CHOICE%"=="2" (
    set "INSTALL_DIR=%LOCAL_DIR%"
    set "INSTALL_TYPE=local"
) else (
    set "INSTALL_DIR=%GLOBAL_DIR%"
    set "INSTALL_TYPE=global"
)

echo.
echo  Installing %INSTALL_TYPE% to: %INSTALL_DIR%
echo.

:: ── Install ───────────────────────────────────────────────────
if exist "%INSTALL_DIR%\" (
    echo  Existing install found. Updating...
    cd /d "%INSTALL_DIR%"
    git pull --ff-only origin master
    echo  [OK] Updated to latest version
) else (
    for %%d in ("%INSTALL_DIR%") do mkdir "%%~dpd" 2>nul
    echo  Cloning from GitHub...
    git clone --depth=1 "%REPO%" "%INSTALL_DIR%"
    echo  [OK] Cloned successfully
)

:: ── Deploy to other AI tools ──────────────────────────────────
echo.
echo  Deploying to other AI tools found on this system...
echo.

set "DEPLOYED="

:: Gemini CLI — ~/.gemini/antigravity/skills/wp-standards/
if exist "%USERPROFILE%\.gemini\antigravity\skills\" (
    if exist "%USERPROFILE%\.gemini\antigravity\skills\wp-standards\" (
        rmdir /s /q "%USERPROFILE%\.gemini\antigravity\skills\wp-standards"
    )
    xcopy /e /i /q "%INSTALL_DIR%" "%USERPROFILE%\.gemini\antigravity\skills\wp-standards" >nul
    echo  [OK] Gemini CLI -- deployed to ~\.gemini\antigravity\skills\wp-standards\
    set "DEPLOYED=!DEPLOYED! Gemini-CLI"
)

:: Codex CLI — ~/.codex/skills/wp-standards/
if exist "%USERPROFILE%\.codex\" (
    if not exist "%USERPROFILE%\.codex\skills\" mkdir "%USERPROFILE%\.codex\skills"
    if exist "%USERPROFILE%\.codex\skills\wp-standards\" (
        rmdir /s /q "%USERPROFILE%\.codex\skills\wp-standards"
    )
    xcopy /e /i /q "%INSTALL_DIR%" "%USERPROFILE%\.codex\skills\wp-standards" >nul
    echo  [OK] Codex CLI -- deployed to ~\.codex\skills\wp-standards\
    set "DEPLOYED=!DEPLOYED! Codex-CLI"
)

:: Cursor — ~/.cursor/skills/wp-standards/
if exist "%USERPROFILE%\.cursor\" (
    if not exist "%USERPROFILE%\.cursor\skills\" mkdir "%USERPROFILE%\.cursor\skills"
    if exist "%USERPROFILE%\.cursor\skills\wp-standards\" (
        rmdir /s /q "%USERPROFILE%\.cursor\skills\wp-standards"
    )
    xcopy /e /i /q "%INSTALL_DIR%" "%USERPROFILE%\.cursor\skills\wp-standards" >nul
    echo  [OK] Cursor -- deployed to ~\.cursor\skills\wp-standards\
    set "DEPLOYED=!DEPLOYED! Cursor"
)

:: Antigravity AI — ~/.antigravity/skills/wp-standards/
if exist "%USERPROFILE%\.antigravity\" (
    if not exist "%USERPROFILE%\.antigravity\skills\" mkdir "%USERPROFILE%\.antigravity\skills"
    if exist "%USERPROFILE%\.antigravity\skills\wp-standards\" (
        rmdir /s /q "%USERPROFILE%\.antigravity\skills\wp-standards"
    )
    xcopy /e /i /q "%INSTALL_DIR%" "%USERPROFILE%\.antigravity\skills\wp-standards" >nul
    echo  [OK] Antigravity AI -- deployed to ~\.antigravity\skills\wp-standards\
    set "DEPLOYED=!DEPLOYED! Antigravity-AI"
)

:: Cagent — ~/.cagent/skills/wp-standards/
if exist "%USERPROFILE%\.cagent\" (
    if not exist "%USERPROFILE%\.cagent\skills\" mkdir "%USERPROFILE%\.cagent\skills"
    if exist "%USERPROFILE%\.cagent\skills\wp-standards\" (
        rmdir /s /q "%USERPROFILE%\.cagent\skills\wp-standards"
    )
    xcopy /e /i /q "%INSTALL_DIR%" "%USERPROFILE%\.cagent\skills\wp-standards" >nul
    echo  [OK] Cagent -- deployed to ~\.cagent\skills\wp-standards\
    set "DEPLOYED=!DEPLOYED! Cagent"
)

:: Kiro — ~/.kiro/skills/wp-standards/
if exist "%USERPROFILE%\.kiro\" (
    if not exist "%USERPROFILE%\.kiro\skills\" mkdir "%USERPROFILE%\.kiro\skills"
    if exist "%USERPROFILE%\.kiro\skills\wp-standards\" (
        rmdir /s /q "%USERPROFILE%\.kiro\skills\wp-standards"
    )
    xcopy /e /i /q "%INSTALL_DIR%" "%USERPROFILE%\.kiro\skills\wp-standards" >nul
    echo  [OK] Kiro -- deployed to ~\.kiro\skills\wp-standards\
    set "DEPLOYED=!DEPLOYED! Kiro"
)

if "%DEPLOYED%"=="" (
    echo  No other AI tools detected ^(only Claude Code installed^)
)

:: ── Success message ───────────────────────────────────────────
echo.
echo  =======================================================
echo    Installation Complete!
echo  =======================================================
echo.
echo  Restart your AI tool, then use the skill:
echo.
echo    /wp-standards ./path/to/plugin --fix
echo.
echo  Or just say:
echo    "Audit my plugin and fix coding standards issues"
echo.
if not "%DEPLOYED%"=="" (
    echo  Also deployed to: %DEPLOYED%
    echo.
)
echo  Docs: https://github.com/Shahreyar46/wp-standards
echo.
pause
