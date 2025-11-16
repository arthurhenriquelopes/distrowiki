@echo off
REM Script para iniciar o Vite Frontend

echo.
echo ========================================
echo  DistroWiki Frontend - Iniciando...
echo ========================================
echo.

cd /d "%~dp0"

REM Tentar encontrar node em locais comuns
echo [*] Procurando Node.js...

REM Opção 1: Node global
where /q node
if %errorlevel% equ 0 (
    echo [OK] Node.js encontrado
    node .\node_modules\.bin\vite
    goto :done
)

REM Opção 2: Instância local do Bun
if exist "%APPDATA%\bun\bin\bun.exe" (
    echo [OK] Bun encontrado
    "%APPDATA%\bun\bin\bun.exe" run dev
    goto :done
)

REM Opção 3: Diretório do programa
if exist "C:\Program Files\nodejs\node.exe" (
    echo [OK] Node.js em Program Files
    "C:\Program Files\nodejs\node.exe" .\node_modules\.bin\vite
    goto :done
)

REM Se nada funcionou
echo.
echo [ERRO] Node.js ou Bun não encontrados!
echo.
echo Soluções:
echo 1. Instalar Node.js: https://nodejs.org/
echo 2. Instalar Bun: https://bun.sh/
echo 3. Verificar PATH
echo.
pause
exit /b 1

:done
echo.
echo [*] Frontend iniciado com sucesso!
echo.
pause
