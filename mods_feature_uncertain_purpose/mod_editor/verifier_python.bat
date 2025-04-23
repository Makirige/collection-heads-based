@echo off
setlocal enabledelayedexpansion

echo ===== DIAGNOSTIC DE L'ENVIRONNEMENT PYTHON =====

REM Chemin spécifique à vérifier
set PYTHON_PATH=C:\Users\zaza-\AppData\Local\Programs\Python\Python313\python.exe
echo Vérification du chemin Python spécifique: !PYTHON_PATH!
if exist "!PYTHON_PATH!" (
    echo [OK] Python 3.13 trouvé au chemin spécifié.
    "!PYTHON_PATH!" --version
) else (
    echo [ERREUR] Python 3.13 n'a pas été trouvé à: !PYTHON_PATH!
)

echo.
echo Recherche d'autres installations Python...
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python trouvé dans le PATH:
    where python
    python --version
) else (
    echo [AVERTISSEMENT] Python n'a pas été trouvé dans le PATH.
)

echo.
echo Recherche du lanceur Python (py)...
where py >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Lanceur Python (py) trouvé dans le PATH:
    where py
    py --version
) else (
    echo [AVERTISSEMENT] Lanceur Python (py) non trouvé dans le PATH.
)

echo.
echo Vérification des modules requis...
if exist "!PYTHON_PATH!" (
    echo Vérification de PyQt6 avec Python 3.13:
    "!PYTHON_PATH!" -c "import PyQt6; print('PyQt6 version:', PyQt6.QtCore.PYQT_VERSION_STR)" 2>nul
    if %errorlevel% neq 0 (
        echo [ERREUR] PyQt6 n'est pas installé pour Python 3.13
        echo Pour installer: "!PYTHON_PATH!" -m pip install PyQt6
    )
) else (
    where python >nul 2>&1
    if %errorlevel% equ 0 (
        echo Vérification de PyQt6 avec Python par défaut:
        python -c "import PyQt6; print('PyQt6 version:', PyQt6.QtCore.PYQT_VERSION_STR)" 2>nul
        if %errorlevel% neq 0 (
            echo [ERREUR] PyQt6 n'est pas installé pour Python par défaut
            echo Pour installer: python -m pip install PyQt6
        )
    )
)

echo.
echo ===== DIAGNOSTIC TERMINÉ =====
echo.
echo Si des erreurs ont été détectées, veuillez:
echo 1. Vérifier que Python est correctement installé
echo 2. Installer PyQt6 avec: python -m pip install PyQt6
echo 3. Mettre à jour le chemin Python dans les scripts de lancement

pause 