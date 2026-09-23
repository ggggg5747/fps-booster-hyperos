/* ============================================================
   FPS Booster PL - HyperOS - Logika aplikacji
   ============================================================ */

// Stan aplikacji
let appliedCount = 0;
let currentMode = 'guide';

// Przełączanie trybu
function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    document.querySelectorAll('.content').forEach(section => {
        section.classList.toggle('active', section.id === `content-${mode}`);
    });

    // Pokaż/ukryj panel logów
    const logPanel = document.getElementById('log-panel');
    if (mode === 'guide') {
        logPanel.style.display = 'none';
    } else {
        logPanel.style.display = 'block';
    }

    // Aktualizuj tryb
    const modeDisplay = document.getElementById('mode-display');
    const modes = { guide: 'Poradnik', adb: 'ADB', root: 'Root' };
    modeDisplay.textContent = modes[mode] || 'Podgląd';
}

// Kopiowanie komendy do schowka
function copyCmd(btn) {
    const code = btn.parentElement.querySelector('code');
    if (!code) return;

    const text = code.textContent;
    const fallback = () => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('📋 Skopiowano!');
        } catch (e) {
            showToast('❌ Błąd kopiowania');
        }
        document.body.removeChild(textarea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 Skopiowano!');
            log(`Skopiowano: ${text.substring(0, 60)}...`);
        }).catch(fallback);
    } else {
        fallback();
    }
}

// Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// Log
function log(message) {
    const logContent = document.getElementById('log-content');
    if (!logContent) return;
    const time = new Date().toLocaleTimeString('pl-PL');
    const entry = document.createElement('div');
    entry.textContent = `[${time}] ${message}`;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
}

// Czyszczenie logów
function clearLog() {
    document.getElementById('log-content').innerHTML = '';
}

// Toggle debloat
function toggleDebloat() {
    const toggle = document.getElementById('toggle-debloat');
    const list = document.getElementById('debloat-list');
    list.style.display = toggle.checked ? 'block' : 'none';
    if (toggle.checked) {
        log('Odblokowano sekcję debloat');
        showToast('⚠ Uważaj na wyłączanie aplikacji systemowych');
    }
}

// Generowanie komendy kompilacji
function generateCompileCmd() {
    const pkg = document.getElementById('pkg-input').value.trim();
    const output = document.getElementById('compile-output');
    if (!pkg) {
        showToast('⚠ Wpisz nazwę pakietu');
        output.innerHTML = '';
        return;
    }

    const cmd = `adb shell cmd package compile -m speed-profile -f ${pkg}`;
    const restoreCmd = `adb shell cmd package compile -m default ${pkg}`;

    output.innerHTML = `
        <div class="cmd-item">
            <span class="cmd-label">Kompiluj:</span>
            <code>${cmd}</code>
            <button class="copy-btn" onclick="copyCmd(this)">📋</button>
        </div>
        <div class="cmd-item restore">
            <span class="cmd-label">Przywróć:</span>
            <code>${restoreCmd}</code>
            <button class="copy-btn" onclick="copyCmd(this)">📋</button>
        </div>
    `;
    log(`Wygenerowano komendę dla: ${pkg}`);
    showToast('✅ Wygenerowano komendę');
}

// Zaznacz wszystkie
function applyAll() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    let count = 0;
    checkboxes.forEach(cb => {
        if (!cb.checked) {
            cb.checked = true;
            count++;
        }
    });

    // Przełączniki
    const toggles = document.querySelectorAll('.toggle input[type="checkbox"]');
    toggles.forEach(t => {
        if (!t.checked) {
            t.checked = true;
            count++;
        }
    });

    if (toggles.length > 0) {
        toggleDebloat();
    }

    appliedCount += count;
    updateAppliedCount();
    showToast(`✅ Zaznaczono ${count} pozycji`);
    log(`Zaznaczono ${count} pozycji jako zrobione`);
}

// Reset
function resetAll() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);

    const toggles = document.querySelectorAll('.toggle input[type="checkbox"]');
    toggles.forEach(t => t.checked = false);

    toggleDebloat();

    appliedCount = 0;
    updateAppliedCount();
    showToast('↩ Zresetowano');
    log('Zresetowano wszystkie zaznaczenia');
}

// Aktualizacja licznika
function updateAppliedCount() {
    const display = document.getElementById('applied-count');
    if (display) {
        const total = document.querySelectorAll('.checklist input:checked').length +
                     document.querySelectorAll('.toggle input:checked').length;
        display.textContent = total;
    }
}

// Nasłuchuj zmian checkboxów
document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
        updateAppliedCount();
    }
});

// Pobieranie skryptu (generowanie blob)
function downloadScript(filename) {
    const scripts = {
        'adb_boost.bat': getAdbBoostScript(),
        'adb_restore.bat': getAdbRestoreScript(),
        'termux_root_boost.sh': getTermuxBoostScript(),
        'termux_root_restore.sh': getTermuxRestoreScript(),
    };

    const content = scripts[filename];
    if (!content) {
        showToast('❌ Nie znaleziono skryptu');
        return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`⬇ Pobrano ${filename}`);
    log(`Pobrano: ${filename}`);
}

// ============================================================
//  SKRYPTY DO POBRANIA (generowane w JS)
// ============================================================

function getAdbBoostScript() {
    return `@echo off
title FPS Booster - ADB Boost (HyperOS)
color 0A

echo ============================================================
echo          ⚡ FPS Booster PL - ADB Boost (HyperOS)
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

:: Sprawdź czy urządzenie jest podłączone
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
`;
}

function getAdbRestoreScript() {
    return `@echo off
title FPS Booster - ADB Restore (HyperOS)
color 0C

echo ============================================================
echo          ↩ FPS Booster PL - ADB Restore (HyperOS)
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
echo [*Wylaczanie bloatware - przywracanie...
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
`;
}

function getTermuxBoostScript() {
    return `#!/bin/bash
# FPS Booster PL - Termux Root Boost (HyperOS)
# Wymaga: root (Magisk), Termux + tsu

RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m'

BACKUP_DIR="$HOME/.fps_booster_backup"
mkdir -p "$BACKUP_DIR"

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}       ⚡ FPS Booster PL - Termux Root Boost${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# Sprawdź root
if ! su -c "id" > /dev/null 2>&1; then
    echo -e "${RED}[BŁĄD] Brak roota. Zainstaluj Magisk i tsu.${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] Root wykryty${NC}"
echo ""

# 1. Backup governor CPU
echo -e "${CYAN}[*] Backup governor CPU...${NC}"
GOV=$(su -c "cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor" 2>/dev/null)
echo "$GOV" > "$BACKUP_DIR/governor_backup.txt"
echo -e "${GREEN}[OK] Governor: $GOV (zapisano backup)${NC}"

# 2. Ustaw governor na performance
echo ""
echo -e "${CYAN}[*] Ustawianie governor CPU na performance...${NC}"
for cpu in 0 1 2 3 4 5 6 7; do
    su -c "echo performance > /sys/devices/system/cpu/cpu${cpu}/cpufreq/scaling_governor" 2>/dev/null
done
echo -e "${GREEN}[OK] Governor ustawiony na performance${NC}"

# 3. Czyść pamięć podręczną
echo ""
echo -e "${CYAN}[*] Czyszczenie pamieci podręcznej...${NC}"
su -c "sync"
su -c "echo 3 > /proc/sys/vm/drop_caches" 2>/dev/null
echo -e "${GREEN}[OK] Pamiec podręczna wyczyszczona${NC}"

# 4. Animacje
echo ""
echo -e "${CYAN}[*] Zmniejszanie animacji (0.5x)...${NC}"
settings put global window_animation_scale 0.5 2>/dev/null || su -c "settings put global window_animation_scale 0.5"
settings put global transition_animation_scale 0.5 2>/dev/null || su -c "settings put global transition_animation_scale 0.5"
settings put global animator_duration_scale 0.5 2>/dev/null || su -c "settings put global animator_duration_scale 0.5"
echo -e "${GREEN}[OK] Animacje zmniejszone do 0.5x${NC}"

# 5. Opcjonalnie 120 Hz
echo ""
read -p "Wymusic 120 Hz? (wplyw na baterie) [t/N]: " REFRESH
if [[ "$REFRESH" == "t" || "$REFRESH" == "T" ]]; then
    echo -e "${CYAN}[*] Ustawianie 120 Hz...${NC}"
    settings put system peak_refresh_rate 120 2>/dev/null || su -c "settings put system peak_refresh_rate 120"
    settings put system min_refresh_rate 120 2>/dev/null || su -c "settings put system min_refresh_rate 120"
    echo -e "${GREEN}[OK] 120 Hz wlaczone${NC}"
fi

# 6. Debloat (opcjonalne)
echo ""
read -p "Wylaczyc bloatware Xiaomi? [t/N]: " DEBLOAT
if [[ "$DEBLOAT" == "t" || "$DEBLOAT" == "T" ]]; then
    echo -e "${CYAN}[*] Wylaczanie bloatware...${NC}"
    su -c "pm disable-user --user 0 com.xiaomi.mipicks" 2>/dev/null
    su -c "pm disable-user --user 0 com.miui.player" 2>/dev/null
    su -c "pm disable-user --user 0 com.miui.video" 2>/dev/null
    su -c "pm disable-user --user 0 com.miui.personalassistant" 2>/dev/null
    echo -e "${GREEN}[OK] Bloatware wylaczony${NC}"
fi

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}[OK] Optymalizacja zakonczona!${NC}"
echo -e "${YELLOW}    Aby przywrocic: uruchom termux_root_restore.sh${NC}"
echo -e "${CYAN}============================================================${NC}"
`;
}

function getTermuxRestoreScript() {
    return `#!/bin/bash
# FPS Booster PL - Termux Root Restore (HyperOS)

RED='\\033[0;31m'
GREEN='\\033[0;32m'
CYAN='\\033[0;36m'
NC='\\033[0m'

BACKUP_DIR="$HOME/.fps_booster_backup"

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}       ↩ FPS Booster PL - Termux Root Restore${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

if ! su -c "id" > /dev/null 2>&1; then
    echo -e "${RED}[BŁĄD] Brak roota.${NC}"
    exit 1
fi

# 1. Przywróć governor
echo -e "${CYAN}[*] Przywracanie governor CPU...${NC}"
if [ -f "$BACKUP_DIR/governor_backup.txt" ]; then
    OLD_GOV=$(cat "$BACKUP_DIR/governor_backup.txt")
    echo -e "    Poprzedni governor: $OLD_GOV"
    for cpu in 0 1 2 3 4 5 6 7; do
        su -c "echo $OLD_GOV > /sys/devices/system/cpu/cpu${cpu}/cpufreq/scaling_governor" 2>/dev/null
    done
    echo -e "${GREEN}[OK] Governor przywrocony: $OLD_GOV${NC}"
else
    echo -e "${YELLOW}[!] Brak backupu governor - ustawiam schedutil${NC}"
    for cpu in 0 1 2 3 4 5 6 7; do
        su -c "echo schedutil > /sys/devices/system/cpu/cpu${cpu}/cpufreq/scaling_governor" 2>/dev/null
    done
    echo -e "${GREEN}[OK] Ustawiono schedutil${NC}"
fi

# 2. Przywróć animacje
echo ""
echo -e "${CYAN}[*] Przywracanie animacji (1.0x)...${NC}"
settings put global window_animation_scale 1.0 2>/dev/null || su -c "settings put global window_animation_scale 1.0"
settings put global transition_animation_scale 1.0 2>/dev/null || su -c "settings put global transition_animation_scale 1.0"
settings put global animator_duration_scale 1.0 2>/dev/null || su -c "settings put global animator_duration_scale 1.0"
echo -e "${GREEN}[OK] Animacje przywrocone do 1.0x${NC}"

# 3. Przywróć 60 Hz
echo ""
echo -e "${CYAN}[*] Przywracanie 60 Hz...${NC}"
settings put system peak_refresh_rate 60 2>/dev/null || su -c "settings put system peak_refresh_rate 60"
settings put system min_refresh_rate 60 2>/dev/null || su -c "settings put system min_refresh_rate 60"
echo -e "${GREEN}[OK] 60 Hz przywrocone${NC}"

# 4. Przywróć bloatware
echo ""
echo -e "${CYAN}[*] Przywracanie bloatware...${NC}"
su -c "pm enable com.xiaomi.mipicks" 2>/dev/null
su -c "pm enable com.miui.player" 2>/dev/null
su -c "pm enable com.miui.video" 2>/dev/null
su -c "pm enable com.miui.personalassistant" 2>/dev/null
echo -e "${GREEN}[OK] Aplikacje przywrocone${NC}"

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}[OK] Przywracanie zakonczone!${NC}"
echo -e "${CYAN}============================================================${NC}"
`;
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    updateAppliedCount();

    // Sprawdź root (Termux only)
    if (typeof Termux !== 'undefined' && Termux.hasOwnProperty('isRootAvailable')) {
        Termux.isRootAvailable().then(root => {
            document.getElementById('root-display').textContent = root ? 'Tak' : 'Nie';
        });
    }

    // Sprawdź PWA install
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Tu można dodać przycisk instalacji
    });

    log('Aplikacja uruchomiona');
});
