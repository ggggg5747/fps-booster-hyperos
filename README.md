# ⚡ FPS Booster PL - HyperOS / Android 15

Aplikacja webowa (PWA) + skrypty ADB/Termux do optymalizacji telefonu Xiaomi z HyperOS (Android 15) pod kątem gier.

## 📱 Jak uruchomić aplikację (PWA)

### Na telefonie:
1. Prześlij pliki na telefon (lub pobierz bezpośrednio)
2. Otwórz plik `index.html` w przeglądarce (Chrome)
3. Menu → "Dodaj do ekranu głównego" → aplikacja zainstalowana
4. Uruchom z ikony na ekranie głównego

### Na PC (podgląd):
1. Otwórz `index.html` w przeglądarce

## 🔌 Skrypty ADB (bez roota)

### Wymagania:
- [Android Platform Tools](https://developer.android.com/tools/releases/platform-tools) (ADB)
- Włączone Debugowanie USB w telefonie (Opcje programisty → Debugowanie USB)
- Telefon podłączony kablem USB do PC

### Jak używać:
1. Pobierz i wypakuj Platform Tools
2. Umieść `adb_boost.bat` i `adb_restore.bat` w folderze z `adb.exe`
3. Podłącz telefon, zaakceptuj "Zezwalaj na debugowanie USB"
4. Uruchom `adb_boost.bat` (kliknij dwukrotnie)
5. Aby cofnąć zmiany → uruchom `adb_restore.bat`

## 🔧 Skrypty Termux (z rootem)

### Wymagania:
- Root (Magisk)
- Aplikacja [Termux](https://f-droid.org/packages/com.termux/)
- Pakiet `tsu` w Termux (`pkg install tsu`)

### Jak używać:
1. Skopiuj `termux_root_boost.sh` i `termux_root_restore.sh` do telefonu
2. W Termux: `tsu` (aby uzyskać root)
3. `bash /ścieżka/do/termux_root_boost.sh`
4. Aby cofnąć: `bash /ścieżka/do/termux_root_restore.sh`

## ⚙️ Co optymalizuje?

### ADB (bez roota):
| Optymalizacja | Opis |
|---|---|
| Skala animacji 0.5x | Przyspiesza interfejs systemowy |
| 120 Hz (opcjonalne) | Wymusza maksymalne odświeżanie ekranu |
| Czyszczenie DNS | Czyści pamięć podręczną DNS |
| Debloat (opcjonalne) | Wyłącza aplikacje Xiaomi (GetApps, Mi Music, Mi Video, Asystent) |
| Kompilacja gry | `cmd package compile -m speed-profile` dla wybranej gry |

### Root (Termux):
| Optymalizacja | Opis |
|---|---|
| Governor CPU: performance | Maksymalna wydajność procesora |
| Czyszczenie pamięci | `echo 3 > /proc/sys/vm/drop_caches` |
| Animacje 0.5x | Zmniejszenie skali animacji |
| 120 Hz | Wymuszenie odświeżania |
| Debloat | Wyłączenie aplikacji bloatware |

### HyperOS (ręcznie w ustawieniach):
- Game Turbo włączony
- Tryb wydajności włączony
- 120 Hz włączone
- Oszczędzanie baterii wyłączone podczas gry
- Rozszerzenie pamięci wyłączone (jeśli 8+ GB RAM)
- Autostart wyłączony dla niepotrzebnych aplikacji
- Powiadomienia pływające wyłączone podczas gry

## 🔒 Bezpieczeństwo

- Wszystkie zmiany ADB można cofnąć skryptem `adb_restore.bat`
- Skrypt Termux zapisuje backup governor CPU przed zmianą
- Skrypt Termux można cofnąć `termux_root_restore.sh`
- Debloat jest opcjonalny i wyłączony domyślnie
- Aplikacja NIE modyfikuje systemu bezpośrednio - jest przewodnikiem i generatorem komend

## ⚠️ Ważne

- Bez roota aplikacja nie może sama zmieniać ustawień systemowych Android 15
- Tryb ADB wymaga włączenia Debugowania USB
- Tryb root/Magisk jest opcjonalny i ryzykowny
- Brak gwarancji wzrostu FPS; celem jest ograniczenie obciążenia tła i opóźnień
- Nie wyłączaj thermal throttling, nie usuwaj aplikacji systemowych, nie zmieniaj jądra/SELinux

## 📁 Zawartość

| Plik | Opis |
|---|---|
| `index.html` | Główna aplikacja PWA |
| `styles.css` | Style (ciemny motyw gamingowy) |
| `app.js` | Logika aplikacji + generatory skryptów |
| `manifest.json` | Manifest PWA (instalacja na ekranie głównego) |
| `icon.svg` | Ikona aplikacji |
| `adb_boost.bat` | Skrypt optymalizacji ADB (Windows PC + telefon) |
| `adb_restore.bat` | Skrypt przywracania ADB |
| `termux_root_boost.sh` | Skrypt optymalizacji root (Termux) |
| `termux_root_restore.sh` | Skrypt przywracania root |
| `README.md` | Ten plik |
