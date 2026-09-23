#!/bin/bash
# FPS Booster PL - Termux Root Restore (HyperOS)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

BACKUP_DIR="$HOME/.fps_booster_backup"

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}       FPS Booster PL - Termux Root Restore${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

if ! su -c "id" > /dev/null 2>&1; then
    echo -e "${RED}[BLAD] Brak roota.${NC}"
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
