@echo off
setlocal enabledelayedexpansion

REM Chemin vers l'exécutable Python
set PYTHON_PATH=C:\Users\zaza-\AppData\Local\Programs\Python\Python313\python.exe

REM Vérifier si Python existe
if not exist "!PYTHON_PATH!" (
    echo Python 3.13 n'a pas été trouvé à: !PYTHON_PATH!
    echo Veuillez installer Python 3.13 ou modifier le chemin dans ce fichier.
    pause
    exit /b 1
)

REM Obtenir le chemin absolu du script
cd /d "%~dp0"

REM Lancer l'application directement via run_app.py
echo Lancement direct de l'application Mod Editor...
"!PYTHON_PATH!" "%~dp0run_app.py"
if errorlevel 1 (
    echo Une erreur s'est produite lors de l'exécution de l'application.
    echo Code d'erreur: !errorlevel!
)

pause 