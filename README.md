# AETHER — Explore Beyond the Unknown

AETHER is a complete, local-first space exploration, 3D visualization, physics simulation, and astronomy learning platform built strictly with **HTML5, CSS3, and Vanilla JavaScript (ES6+ Modules)**.

It runs directly on `localhost` with **no backend server, no Firebase, no Supabase, and no external database**. All accounts, learning progress, quiz scores, bookmarks, favorites, achievements, and activity logs persist locally in your browser using **IndexedDB (`AETHER_DATABASE`)**.

---

## Key Features

1. **Mission Control Dashboard** — Personalized greeting, live UTC clock, NASA Astronomy Picture of the Day (APOD) with offline historical fallback, Chart.js planetary gravity comparison, NASA JPL CNEOS reference table, active learning path progress, and recently explored objects.
2. **Interactive 3D Solar System** — Three.js 3D Sun and all eight planets with procedural planetary textures, orbital paths, labels, camera focus, speed/pause controls, resource disposal, and an automatic 2D Canvas fallback if WebGL is unavailable.
3. **Planet Explorer** — Complete NASA NSSDC-referenced encyclopedia for Mercury through Neptune with search, classification filters, sorting, side-by-side comparison tool, and favorites.
4. **Space Missions** — Detailed dossiers for Apollo 11, Voyager 1 & 2, James Webb Space Telescope, Hubble, Mars Perseverance, Artemis Program, Parker Solar Probe, Cassini-Huygens, and Juno.
5. **Satellite Tracker** — Verified orbital regimes (LEO, MEO, GEO, Sun-Earth L2), search/category filters, and an educational Earth orbital visualizer clearly labeled as a simulation.
6. **Space Simulator** — Interactive physics laboratory featuring an SI-unit Newtonian Gravity Calculator & Visualizer (`F = G m₁ m₂ / r²`) and an RK4 Two-Body Orbital Mechanics simulator (circular, elliptical, and escape trajectories).
7. **Deep Space Exploration** — Catalog covering Galaxies, Nebulae, Star Clusters, Black Holes, Exoplanets, Supernovae, and Cosmic Phenomena.
8. **Space Academy & Learning Paths** — 16 astronomy courses, 7 structured Learning Paths, interactive lesson knowledge checks, MC/True-False quizzes with score persistence, 6 unlockable achievements, and printable AETHER educational completion certificates.
9. **Space Timeline & Space Gallery** — Historically verified spaceflight chronology (1957–present) and responsive NASA/ESA gallery with fullscreen lightbox and optional live NASA Image Library search.
10. **Global Search, Favorites, Notifications, Profile, Settings & About the Creator** — Unified search across all content types, per-user IndexedDB privacy, validated JSON backup export/import, dark/light/system themes, and creator profile for **Michael Milad Sameer**.

---

## Technology Stack

- **Core:** HTML5, CSS3 (Custom Properties, Grid, Flexbox), Vanilla JavaScript (ES6+ Modules)
- **Local Database:** Browser IndexedDB (`AETHER_DATABASE` with 12 object stores)
- **UI Preferences:** Browser `LocalStorage` (theme, sidebar state, reduced motion, sound toggle — never passwords)
- **Password Derivation:** Browser Web Crypto API (`PBKDF2-SHA256`, 100,000 iterations, random 16-byte salt)
- **Optional CDN Libraries:** Three.js (3D Solar System), Chart.js (Dashboard charts), Lucide Icons (UI icons) — all with graceful offline fallbacks.

---

## Project Structure

```text
AETHER/
├── index.html
├── README.md
├── assets/
│   └── images/
│       ├── README.txt
│       └── creator.jpg          <-- Place your creator portrait here
├── css/
│   ├── variables.css
│   ├── style.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   ├── pages.css
│   └── responsive.css
├── data/
│   └── initial-data.js
└── js/
    ├── app.js
    ├── router.js
    ├── navigation.js
    ├── footer.js
    ├── auth.js
    ├── dashboard.js
    ├── solar-system.js
    ├── planets.js
    ├── missions.js
    ├── satellites.js
    ├── simulator.js
    ├── deep-space.js
    ├── academy.js
    ├── learning-paths.js
    ├── lessons.js
    ├── quizzes.js
    ├── timeline.js
    ├── gallery.js
    ├── search.js
    ├── favorites.js
    ├── notifications.js
    ├── profile.js
    ├── settings.js
    ├── about.js
    ├── database/
    │   ├── schema.js
    │   ├── db.js
    │   ├── users-db.js
    │   ├── progress-db.js
    │   ├── favorites-db.js
    │   └── backup.js
    ├── api/
    │   ├── nasa.js
    │   ├── jpl.js
    │   ├── images.js
    │   └── data-service.js
    ├── data/
    │   ├── planets.js
    │   ├── missions.js
    │   ├── deep-space.js
    │   ├── timeline.js
    │   ├── courses.js
    │   ├── lessons.js
    │   └── sources.js
    └── utils/
        ├── storage.js
        ├── crypto.js
        ├── validation.js
        ├── helpers.js
        └── components.js
```

---

## How to Run Locally (`http://localhost:5500/`)

Because AETHER uses JavaScript ES Modules (`type="module"`) and the Web Crypto API (`crypto.subtle`), open it through a local HTTP server rather than double-clicking `index.html` via `file://`.

### Option 1: VS Code Live Server (Recommended)
1. Open the `AETHER` folder in Visual Studio Code.
2. Install the **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` and choose **Open with Live Server**.
4. Your browser will open `http://127.0.0.1:5500/` or `http://localhost:5500/`.

### Option 2: Simple Local HTTP Server
If you have a lightweight static file server installed (for example, `npx serve -l 5500 .` or `python3 -m http.server 5500`), run it inside the `AETHER/` directory and navigate to:

```text
http://localhost:5500/
```

---

## Adding the Creator Photograph

Place your portrait image at:

```text
creator.jpg (in the same folder as index.html)
```

The **About the Creator** page automatically renders this image using `object-fit: cover` while preserving aspect ratio. If the file is missing, AETHER displays a clean monogram fallback without broken image icons.

---

## How IndexedDB & Local Accounts Work

- **Database Name:** `AETHER_DATABASE`
- **Object Stores:** `users`, `profiles`, `courses`, `learningProgress`, `lessons`, `quizResults`, `favorites`, `bookmarks`, `achievements`, `activity`, `notifications`, `recentlyViewed`.
- **Password Security:** Passwords are derived locally using Web Crypto `PBKDF2-SHA256` with a unique random salt per account. Plaintext passwords are never stored. *(Note: This is a local educational account system for single-browser use, not server-side authentication.)*
- **Session & Multi-User Isolation:** Each user's lessons, quizzes, favorites, bookmarks, and notifications are keyed by `userId`, keeping local accounts completely separate.
- **Backup & Restore:** Open **Settings → Local Data Backup & Restore** to export your progress as a `.json` file or import a previously exported backup.

---

## Public NASA & JPL APIs

- **NASA APOD (`https://api.nasa.gov/planetary/apod`)** uses NASA's public `DEMO_KEY` by default (you can enter your own free NASA API key in **Settings**). Responses are cached for 6 hours; if offline or rate-limited, AETHER displays a clearly labeled **Historical** reference fallback.
- **NASA Image and Video Library (`https://images-api.nasa.gov/search`)** powers optional live searches in **Space Gallery**.
- **NASA JPL SSD (`https://ssd-api.jpl.nasa.gov/cad.api`)** is queried on Mission Control; if blocked by browser CORS or offline mode, AETHER displays verified historical NASA JPL CNEOS reference records.

---

## Known Limitations & Troubleshooting

- **Local Browser Storage Only:** Data stored in IndexedDB is tied to your specific browser and origin (`http://localhost:5500` and `http://127.0.0.1:5500` are treated as separate origins by browsers). Always use the same URL so your account appears consistently.
- **Clearing Browser Data:** Clearing site data/cookies for localhost will erase `AETHER_DATABASE`. Export a JSON backup in Settings beforehand.
- **ES Modules Not Loading (`file://`):** Always run via `http://localhost:5500/` instead of opening `index.html` directly from the file explorer.
- **WebGL Disabled:** If your device disables WebGL, the 3D Solar System automatically falls back to a 2D Canvas orbital visualization.

---

## Credits & Disclaimer

**© 2026 AETHER — Explore Beyond the Unknown.**  
Designed & Developed by **Michael Milad Sameer** (`michaelmelad49@gmail.com`).

*AETHER is an independent educational and exploration project. It is not an official NASA or ESA product and is not affiliated with or endorsed by NASA or ESA.*


---

## Flat GitHub-Ready Structure
All HTML, CSS, and JavaScript files are placed in the same root folder alongside `index.html` so you can upload all files directly to a GitHub repository or deploy immediately on GitHub Pages without nested folders. Place your portrait image directly as `creator.jpg` next to `index.html`.
