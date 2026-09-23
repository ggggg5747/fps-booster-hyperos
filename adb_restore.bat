@echo off
title FPS Booster - ADB Restore (HyperOS)
color 0C

echo ============================================================
echo          FPS Booster PL - ADB Restore (HyperOS)
echo ============================================================
echo.

where adb >nul 2>&1
if %errorlevel% neq 0 (
    echo [BLAD] ADB nie jest w PATH.
    pause
    exit /b 1
)

echo [*] Przywracanie ustawien domyslnych...

echo [*] Animacje 1.0x...
adb shell settings put global window_animation_scale 1.0
adb shell settings put global transition_animation_scale 1.0
adb shell settings put global animator_duration_scale 1.0
echo [OK] Animacje przywrocone

echo.
echo [*] Odswiezanie 60 Hz...
adb shell settings put system peak_refresh_rate 60
adb shell settings put system min_refresh_rate 60
echo [OK] 60 Hz przywrocone

echo.
echo [*] Bloatware - przywracanie...
adb shell pm enable com.xiaomi.mipicks 2>nul
adb shell pm enable com.miui.player 2>nul
adb shell pm enable com.miui.video 2>nul
adb shell pm enable com.miui.personalassistant 2>nul
echo [OK] Aplikacje przywrocone

echo.
echo ============================================================
echo [OK] Przywracanie zakonczone!
echo ============================================================
pause
