@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  ===================================================
echo   Atualizando o catalogo de produtos...
echo  ===================================================
echo.
node gerar-catalogo.js
if %errorlevel% neq 0 (
  echo.
  echo  [ERRO] Nao foi possivel rodar o gerador.
  echo  Verifique se o Node.js esta instalado: https://nodejs.org
)
echo.
echo  Pronto! Abra o arquivo "index.html" para ver o catalogo.
echo.
pause
