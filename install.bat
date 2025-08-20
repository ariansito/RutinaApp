@echo off
echo ========================================
echo    INSTALADOR AUTOMATICO RUTINAAPP
echo ========================================
echo.

echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js encontrado
echo.

echo [2/5] Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias
    pause
    exit /b 1
)
echo ✓ Dependencias instaladas
echo.

echo [3/5] Instalando Capacitor CLI...
npm install -g @capacitor/cli
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar Capacitor CLI
    pause
    exit /b 1
)
echo ✓ Capacitor CLI instalado
echo.

echo [4/5] Inicializando Capacitor...
npx cap init RutinaApp com.rutinaapp.app --web-dir=.
if %errorlevel% neq 0 (
    echo ERROR: Fallo al inicializar Capacitor
    pause
    exit /b 1
)
echo ✓ Capacitor inicializado
echo.

echo [5/5] Agregando plataformas...
npx cap add ios
npx cap add android
if %errorlevel% neq 0 (
    echo ERROR: Fallo al agregar plataformas
    pause
    exit /b 1
)
echo ✓ Plataformas agregadas
echo.

echo ========================================
echo    INSTALACION COMPLETADA EXITOSAMENTE
echo ========================================
echo.
echo Proximos pasos:
echo 1. Para iOS: npx cap open ios
echo 2. Para Android: npx cap open android
echo 3. Configurar Firebase para notificaciones
echo 4. Probar en dispositivos reales
echo.
echo ¡Tu app esta lista para iOS y Android!
echo.
pause
