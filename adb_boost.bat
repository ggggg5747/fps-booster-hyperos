@echo off
title FPS Booster - ADB Boost (HyperOS)
color 0A

echo ============================================================
echo          FPS Booster PL - ADB Boost (HyperOS)
echo ============================================================
echo.

:: Sprawdzenie ADB
where adb >nul 2>&1
if %errorlevel% neq 0 (
    echo [BLAD] ADB nie jest w PATH.
    echo         Pobierz Android Platform Tools i dodaj do PATH.
    echo         Lub umiesc adb.exe w tym samym folderze.
    pause
    exit /b 1
)

echo [*] Sprawdzanie polaczenia z telefonem...
adb devices
echo.

adb get-state >nul 2>&1
if %errorlevel% neq 0 (
    echo [BLAD] Nie wykryto telefonu.
    echo         Wlacz Debugowanie USB w Opcjach programisty.
    echo         Zaakceptuj okno "Zezwol na debugowanie USB" na telefonie.
    pause
    exit /b 1
)

echo [*] Telefon wykryty!
echo.
echo ============================================================

echo [*] Zmniejszanie skali animacji (0.5x)...
adb shell settings put global window_animation_scale 0.5
adb shell settings put global transition_animation_scale 0.5
adb shell settings put global animator_duration_scale 0.5
echo [OK] Animacje zmniejszone do 0.5x

echo.
echo [*] Czyszczenie pamieci podręcznej DNS...
adb shell ndc resolver flushdefaultif 2>nul
echo [OK] DNS wyczyszczony

echo.
set /p REFRESH="Czy wymusic 120 Hz? (moze wplywac na bateria) [t/N]: "
if /i "%REFRESH%"=="t" (
    echo [*] Ustawianie 120 Hz...
    adb shell settings put system peak_refresh_rate 120
    adb shell settings put system min_refresh_rate 120
    echo [OK] 120 Hz wlaczone
)

echo.
set /p DEBLOAT="Czy wylaczyc aplikacje bloatware Xiaomi? [t/N]: "
if /i "%DEBLOAT%"=="t" (
    echo [*] Wylaczanie bloatware...
    adb shell pm disable-user --user 0 com.xiaomi.mipicks 2>nul
    adb shell pm disable-user --user 0 com.miui.player 2>nul
    adb shell pm disable-user --user 0 com.miui.video 2>nul
    adb shell pm disable-user --user 0 com.miui.personalassistant 2>nul
    echo [OK] Bloatware wylaczony (mozna przywrocic adb_restore.bat)
)

echo.
echo ============================================================
echo [OK] Optymalizacja ADB zakonczona!
echo     Restart telefonu moze byc wymagany dla pelnego efektu.
echo ============================================================
pause
