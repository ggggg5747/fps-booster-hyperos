#!/bin/bash
# FPS Booster PL - Termux Root Boost (HyperOS)
# Wymaga: root (Magisk), Termux + tsu

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

BACKUP_DIR="$HOME/.fps_booster_backup"
mkdir -p "$BACKUP_DIR"

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}       FPS Booster PL - Termux Root Boost${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# Sprawdź root
if ! su -c "id" > /dev/null 2>&1; then
    echo -e "${RED}[BLAD] Brak roota. Zainstaluj Magisk i tsu.${NC}"
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
