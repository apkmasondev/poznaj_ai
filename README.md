# Poznaj AI - Przewodnik dla Początkujących

Ten plik (README) jest przeznaczony dla przyszłych programistów pracujących nad tym projektem. Zawiera kluczowe informacje o architekturze, technologiach i założeniach projektowych.

## 🛠️ Stack Technologiczny

Projekt jest celowo maksymalnie uproszczony, aby ułatwić modyfikacje i szybkie ładowanie.

- **HTML5**: Semantyczny, czysty HTML.
- **CSS3**: Vanilla CSS. Brak preprocesorów (SASS) czy frameworków (Tailwind). Całość stylów znajduje się w `style.css`.
- **JavaScript**: Vanilla JS (`app.js`). Brak bibliotek (React, Vue, jQuery).

## 📂 Struktura Plików

- `index.html` - Główny plik struktury. Zawiera sekcję Hero, nawigację, animowaną "oś czasu" z krokami oraz sekcję końcową z kartami modeli AI (ChatGPT, Gemini, Claude).
- `style.css` - Plik ze stylami. Wykorzystuje potężny system **Zmiennych CSS** (CSS Custom Properties) do zarządzania kolorami i motywem dark/light. Zawiera również kluczowe animacje (np. oddychający organiczny blob w Hero, rysowanie wężyka).
- `app.js` - Logika interaktywna:
  1. `IntersectionObserver` do animacji wjeżdżających elementów (fade-in up).
  2. Scroll Listener do "rysowania" czerwonej linii osi czasu w miarę przewijania.
  3. Efekt Parallax (śledzenie myszki) przeliczający koordynaty i przekazujący je do CSS (`--mouse-x`, `--parallax-x`).
  4. Efekt 3D Tilt dla kafelków w sekcji CTA.
  5. Przełącznik jasnego/ciemnego motywu oparty o `localStorage`.
- `images/` - Folder z grafikami. Ze względów optymalizacyjnych wszystkie ciężkie ilustracje 3D (claymation) używają skompresowanego formatu `.webp`, a ikony i logotypy narzędzi oparte są wyłącznie o wektorowe pliki `.svg` (brak ociężałych plików PNG).
- `favicon.svg` - Prosta favicona wektorowa zrobiona z użyciem SVG.
- `robots.txt` - Plik konfiguracyjny dla robotów indeksujących (m.in. Googlebot).
- `sitemap.xml` - Mapa witryny wspierająca pozycjonowanie (SEO).
