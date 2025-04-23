@echo off
setlocal enabledelayedexpansion

REM Rechercher Python automatiquement
where python >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
) else (
    where py >nul 2>&1
    if %errorlevel% equ 0 (
        set PYTHON_CMD=py
    ) else (
        echo Python n'a pas été trouvé dans le PATH.
        echo Veuillez installer Python ou l'ajouter au PATH.
        pause
        exit /b 1
    )
)

REM Obtenir le chemin absolu du répertoire parent
cd /d "%~dp0"
cd ..

REM Lancer l'application via le module Python
echo Lancement de l'application Mod Editor...
%PYTHON_CMD% -m mod_editor
if errorlevel 1 (
    echo Une erreur s'est produite lors de l'exécution de l'application.
    echo Code d'erreur: !errorlevel!
)

pause 