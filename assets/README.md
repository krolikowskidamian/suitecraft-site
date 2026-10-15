# SuiteCraft — biblioteka grafik

Otwórz [galerię grafik](index.html) lokalnie w przeglądarce: miniatury, wyszukiwanie, kategorie, pełny podgląd i pobieranie oryginałów. Galeria działa również bez serwera.

Istniejące ścieżki używane przez landing page pozostają bez zmian. Identyczne pliki mają jeden oryginał; alternatywne nazwy są zapisane w katalogu. Wersje historyczne i podglądy projektu są oznaczone osobno.

## Foldery

| Folder | Zawartość |
| --- | --- |
| `brand/` | Marka i logo |
| `social/` | Social media |
| `marketing/` | Materiały promocyjne |
| `screenshots/` | Screenshoty produktu |
| `previews/` | Podglądy projektu |
| `archive/` | Archiwum |
| `damian-krolikowski.jpg` | Autor |

Zdjęcie autora pozostaje w `damian-krolikowski.jpg`, a symbol używany przez stronę w `suitecraft-mark.svg`. Pliki CSS i JS landing page zachowują swoje dotychczasowe ścieżki.

## Aktualizacja katalogu

Po dodaniu grafiki do odpowiedniego folderu uruchom z katalogu repozytorium:

```sh
python3 scripts/build-asset-gallery.py
```

Opcjonalne nazwy, statusy i pochodzenie edytuj w `assets/metadata.json`. Generator zapisuje `catalog.json`, `gallery-data.js` i ten indeks. Nie wymaga dodatkowych bibliotek.

## Zawartość

| Podgląd / oryginał | Format | Wymiary | Status |
| --- | --- | --- |
| [Ikona rozszerzenia · 128 px](brand/icons/icon-128.png) | PNG | 128 × 128 | brand |
| [Ikona rozszerzenia · 16 px](brand/icons/icon-16.png) | PNG | 16 × 16 | brand |
| [Ikona rozszerzenia · 32 px](brand/icons/icon-32.png) | PNG | 32 × 32 | brand |
| [Ikona rozszerzenia · 48 px](brand/icons/icon-48.png) | PNG | 48 × 48 | brand |
| [Ikona · edytowalny SVG](brand/icons/icon-source.svg) | SVG | 654.0 × 654.0 | brand |
| [Ikona · oryginał PNG](brand/originals/suitecraft-icon-original.png) | PNG | 654 × 654 | variant |
| [Ikona · oryginał SVG](brand/originals/suitecraft-icon-original.svg) | SVG | 654.0 × 654.0 | variant |
| [Logo SuiteCraft · wariant](brand/originals/suitecraft-logo-large-alternative.png) | PNG | 974 × 974 | variant |
| [Logo SuiteCraft · oryginał](brand/originals/suitecraft-logo-large.png) | PNG | 1254 × 1254 | variant |
| [Logo SuiteCraft · pełna wersja SVG](brand/suitecraft-logo.svg) | SVG | 760.0 × 230.0 | brand |
| [Symbol SuiteCraft · na ciemne tło](brand/suitecraft-mark-on-dark.svg) | SVG | 565.0 × 470.0 | brand |
| [Symbol SuiteCraft · na jasne tło](brand/suitecraft-mark-on-light.svg) | SVG | 565.0 × 470.0 | brand |
| [Symbol SuiteCraft](brand/suitecraft-mark.svg) | SVG | 654.0 × 654.0 | brand |
| [Symbol SuiteCraft](suitecraft-mark.svg) | SVG | 654.0 × 654.0 | brand |
| [LinkedIn · banner strony SuiteCraft](social/suitecraft-linkedin-banner-1512x256.png) | PNG | 1512 × 256 | ready |
| [LinkedIn · edytowalny banner SVG](social/suitecraft-linkedin-banner-1512x256.svg) | SVG | 1512.0 × 256.0 | source |
| [Buy Me a Coffee · oryginał](marketing/buy-me-a-coffee/suitecraft-buymeacoffee-cover-source.png) | PNG | 1774 × 887 | source |
| [Buy Me a Coffee · gotowa okładka](marketing/buy-me-a-coffee/suitecraft-buymeacoffee-cover.png) | PNG | 1600 × 400 | ready |
| [Chrome Web Store · kafelek promocyjny](marketing/chrome-web-store/promo-440x280-current.png) | PNG | 440 × 280 | ready |
| [Chrome Web Store · duży banner, wariant](marketing/chrome-web-store/promo-marquee-1400x560-alternative.png) | PNG | 1398 × 399 | variant |
| [Chrome Web Store · duży banner](marketing/chrome-web-store/promo-marquee-1400x560.png) | PNG | 1400 × 560 | variant |
| [Chrome Web Store · kafelek, wariant](marketing/chrome-web-store/promo-small-440x280-alternative.png) | PNG | 440 × 280 | variant |
| [Quick Access · popup](screenshots/01-quick-access.png) | PNG | 1054 × 1492 | ready |
| [Customization Workspace](screenshots/02-catalogue.png) | PNG | 1280 × 800 | ready |
| [Record Explorer](screenshots/03-record-explorer.png) | PNG | 1280 × 800 | ready |
| [Record Explorer · starszy kadr](screenshots/03-record-object.png) | PNG | 1440 × 1000 | archive |
| [Compare](screenshots/04-compare.png) | PNG | 1280 × 800 | ready |
| [Synchronization](screenshots/05-synchronization.png) | PNG | 1280 × 800 | ready |
| [Favorites](screenshots/06-favorites.png) | PNG | 1440 × 1000 | ready |
| [Script & Workflow Inspector](screenshots/07-script-workflow-inspector.png) | PNG | 1280 × 800 | ready |
| [Change Plans](screenshots/08-change-plans.png) | PNG | 1280 × 800 | ready |
| [SuiteCraft Search](screenshots/09-navigation-search.png) | PNG | 1441 × 1092 | ready |
| [Reference Lists](screenshots/10-reference-lists.png) | PNG | 1440 × 1000 | ready |
| [Settings](screenshots/11-settings.png) | PNG | 1440 × 1000 | ready |
| [List Synchronization](screenshots/12-list-synchronization.png) | PNG | 1440 × 1000 | ready |
| [Quick Access · wyszukiwanie list](screenshots/13-popup-list-search.png) | PNG | 1440 × 1000 | ready |
| [Quick Access · starszy kadr źródłowy](screenshots/source/01-quick-access-portrait.png) | PNG | 480 × 760 | archive |
| [Demo Catalogue · dark](previews/catalogue-demo/suitecraft-catalogue-dark.png) | PNG | 1440 × 1000 | preview |
| [Demo Catalogue · desktop](previews/catalogue-demo/suitecraft-catalogue-desktop.png) | PNG | 1440 × 1000 | preview |
| [Demo Catalogue · expanded](previews/catalogue-demo/suitecraft-catalogue-expanded.png) | PNG | 1440 × 1000 | preview |
| [Demo Catalogue · mobile result](previews/catalogue-demo/suitecraft-catalogue-mobile-result.png) | PNG | 390 × 1000 | preview |
| [Demo Catalogue · mobile top](previews/catalogue-demo/suitecraft-catalogue-mobile-top.png) | PNG | 390 × 1000 | preview |
| [Landing page · desktop](previews/landing-page/suitecraft-about-desktop.png) | PNG | 1440 × 1100 | preview |
| [Landing page · mobile](previews/landing-page/suitecraft-about-mobile.png) | PNG | 390 × 1100 | preview |
| [Archiwum · 02 catalogue 1280x800](archive/store/02-catalogue-1280x800.png) | PNG | 1280 × 800 | archive |
| [Archiwum · 03 record object 1280x800](archive/store/03-record-object-1280x800.png) | PNG | 1280 × 800 | archive |
| [Archiwum · 04 compare 1280x800](archive/store/04-compare-1280x800.png) | PNG | 1280 × 800 | archive |
| [Archiwum · 05 synchronization 1280x800](archive/store/05-synchronization-1280x800.png) | PNG | 1280 × 800 | archive |
| [Archiwum · 06 favorites 1280x800](archive/store/06-favorites-1280x800.png) | PNG | 1280 × 800 | archive |
| [Archiwum · 02 catalogue](archive/website/02-catalogue.png) | PNG | 1440 × 1000 | archive |
| [Archiwum · 04 compare](archive/website/04-compare.png) | PNG | 1440 × 1000 | archive |
| [Archiwum · 05 synchronization](archive/website/05-synchronization.png) | PNG | 1440 × 1000 | archive |
| [Archiwum · 06 favorites](archive/website/06-favorites.png) | PNG | 1440 × 1000 | archive |
| [Damian Królikowski · zdjęcie autora](damian-krolikowski.jpg) | JPG | 800 × 800 | ready |

## Pochodzenie

Zebrano materiały marki, bannery, publiczne grafiki Store, screenshoty ze sztucznymi danymi oraz podglądy strony. Importowane grafiki zachowują oryginalne bajty. Szczegóły wcześniejszej anonimizacji screenshotów znajdują się w [screenshots/README.md](screenshots/README.md).

Surowe zrzuty z kont klientów, źródła rozszerzenia, buildy ZIP i prywatne makiety nie należą do tej biblioteki. Przed dodaniem nowych materiałów sprawdź, czy nie zawierają danych klienta. Galeria nie wysyła plików ani wyszukiwań do żadnego serwisu.
