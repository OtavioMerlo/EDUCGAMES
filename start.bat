@echo off
echo.
echo  ╔════════════════════════════════════════╗
echo  ║         EducaGames - Iniciando         ║
echo  ╚════════════════════════════════════════╝
echo.

:: Start backend
echo [1/2] Iniciando backend (porta 3001)...
start "EducaGames API" cmd /k "cd /d %~dp0server && npm run dev"

:: Wait 3 seconds for backend to start
timeout /t 3 /nobreak > NUL

:: Start frontend
echo [2/2] Iniciando frontend (porta 5173)...
start "EducaGames Client" cmd /k "cd /d %~dp0client && npm run dev"

:: Wait for frontend to start
timeout /t 4 /nobreak > NUL

:: Open browser
echo.
echo  ✅ Abrindo navegador...
start http://localhost:5173

echo.
echo  ╔════════════════════════════════════════╗
echo  ║  EducaGames rodando!                   ║
echo  ║                                        ║
echo  ║  Frontend: http://localhost:5173       ║
echo  ║  Backend:  http://localhost:3001       ║
echo  ║                                        ║
echo  ║  Contas de demo:                       ║
echo  ║  aluno@educagames.com / student123     ║
echo  ║  professor@educagames.com / teacher123 ║
echo  ║  admin@educagames.com / admin123       ║
echo  ╚════════════════════════════════════════╝
echo.
pause
