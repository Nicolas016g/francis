@echo off
chcp 65001 >nul
color 0A
title Franci's Creative Kitchen - Remote Access

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   Franci's Creative Kitchen - Sistema de Acesso Remoto        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

cd /d "c:\Users\LOCAL_ADM\Desktop\SiteChico\site-chico"

REM Limpar cache old
if exist .next (
  echo [INFO] Limpando cache anterior...
  rmdir /s /q .next >nul 2>&1
)

echo [ETAPA 1/2] Iniciando servidor Next.js na porta 3000...
echo Aguarde 5-8 segundos para o servidor ficar pronto...
echo.
start "NextJS_Dev_Server" cmd /k "npx next dev"

REM Aguardar Next.js ficar pronto
timeout /t 8 /nobreak

echo.
echo [ETAPA 2/2] Expondo com ngrok...
echo.
start "ngrok_Tunnel" cmd /k "ngrok http 3000"

REM Aguardar ngrok inicializar
timeout /t 3 /nobreak

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                     ✓ Configuração Completa                   ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║                                                                ║
echo ║  1. Aguarde a URL aparecendo na janela "ngrok_Tunnel"         ║
echo ║  2. A URL terá este formato:                                  ║
echo ║     https://xxxxxxxx.ngrok-free.dev                           ║
echo ║  3. Compartilhe COM O CLIENTE (ex: Araraquara)                ║
echo ║  4. Cliente acessa: https://xxxxxxxx.ngrok-free.dev           ║
echo ║                                                                ║
echo ║  ✓ Servidor local: http://localhost:3000                      ║
echo ║  ✓ Configuração ngrok: Automática                             ║
echo ║  ✓ HMR: Desabilitado (melhor para acesso remoto)              ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo AGUARDANDO... Pressione qualquer tecla para ENCERRAR.
pause >nul

echo.
echo Encerrando servicos...
taskkill /FI "WINDOWTITLE eq NextJS_Dev_Server" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq ngrok_Tunnel" /T /F >nul 2>&1
echo Encerramiento concluído.
timeout /t 2 >nul
exit
