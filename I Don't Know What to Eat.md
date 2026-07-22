---
project: I Don't Know What to Eat
status: 🚀 Active
tags:
  - restaurant-filter
  - projects
  - web-app
started: 2026-07-22
language: HTML, CSS, JavaScript
---

## What It Is

A premium, interactive restaurant discovery and decision suite web application designed to solve the age-old dilemma of "What should we eat?". The app features an interactive Decision Engine (Wheel of Fortune Roulette with physical audio ticks and Head-to-Head Food Battle Tournament), dietary restriction filters (Vegan, Vegetarian, Halal, Gluten-Free), interactive Google Maps & Vector Radar Map, and LocalStorage persistence for favorites and custom user spots.

---

## Goals

- [x] Implement a premium glassmorphic dark-mode user interface with responsive side-by-side filter and map/list views.
- [x] Integrate Google Maps JS API for location search, auto-complete, and marker mapping.
- [x] Implement a fallback/mock interactive SVG-based map component with zoom/pan controls and pin preview cards.
- [x] Build a customizable "Surprise Me" selection wheel with smooth canvas spin physics, audio ticks, and confetti particle burst.
- [x] Develop comprehensive client-side sorting and multi-criteria filtering (cuisine, distance, rating, budget, dietary tags).
- [x] Build local storage capabilities to save favorite restaurants and add custom hidden gem spots.

---

## Tech Stack

| Layer | Tool / Language |
|-------|----------------|
| Language | HTML5, CSS3 (Vanilla), JavaScript (ES6+) |
| Libraries | Google Maps JavaScript API, Lucide Icons (CDN), Web Audio API |
| Storage | LocalStorage (Favorites, Saved Custom Spots) |
| Platform | Client-side Web Application |

---

## Architecture / How It Works

The web application operates entirely client-side for ease of deployment, fast performance, and privacy:
1. **User Interface (`index.html` & `style.css`):** Built with custom HSL color tokens, glassmorphism blur panels, glowing background accents, micro-interactions, responsive sidebars, custom range sliders, price selectors, and diet pills.
2. **Master Logic Engine (`app.js`):** Coordinates application state:
   - **Decision Engine:** Renders the Wheel of Fortune (HTML5 Canvas with deceleration physics and tick sound effects) and Food Battle (head-to-head tournament voting).
   - **Synthesized Audio System:** Uses the browser Web Audio API to synthesize mechanical wheel ticks and victory chimes.
   - **Vector Radar Map & Google Maps:** Seamlessly handles Google Maps when an API key is present or falls back to an interactive vector map with pin preview drawers and zoom controls.
   - **Filter & Search Engine:** Instant multi-criteria evaluation with embedded list sorting (Rating, Distance, Price, Name) and preset chips.
   - **LocalStorage Manager:** Stores bookmarked favorites and custom user restaurants.
3. **Configurations (`config.js`):** Separates user Google Maps API key configuration from application code.

---

## Progress Log

### 2026-07-22
- Created the project directory `Projects/I Don't Know What to Eat` and structured base files.
- Initialized `I Don't Know What to Eat.md` project log and roadmap.
- Set up a robust `.gitignore` file to prevent committing API keys or environment configs.
- Built a premium glassmorphic frontend structure (`index.html`) with responsive sidebar filtering, search suggestions, visual map frame, and "Surprise Me" selection wheel interface.
- Developed styled components (`style.css`) using custom HSL colors, glassmorphism blur effects, micro-interactions, and spin animations.
- Remade the complete frontend into a v2.0 Pro decision suite:
  - Added interactive decision modes: Wheel of Food and Head-to-Head Food Battle.
  - Added Web Audio API synthesizer for realistic ticker sounds and victory chimes.
  - Added Canvas Confetti particle FX for winning moments.
  - Added Dietary Restriction filters (Vegan 🌿, Vegetarian 🥗, Halal 🌙, Gluten-Free 🌾) and quick preset filters (Top Rated, Budget Eats, Under 1km, Open Late).
  - Added Favorites system and Add Custom Spot modal with LocalStorage persistence.
  - Upgraded Fallback Vector Radar Map with zoom controls, pan controls, and pin preview popup drawer.
- Cleaned up frontend layout based on user feedback:
  - Fixed SVG pulse animations to animate circle radius `r` cleanly at pin positions.
  - Improved contrast and contrast readability on spin action buttons.
  - Removed popup modal inner scrollbar by compacting vertical paddings and details grid.
  - Relocated Sort By dropdown inside the Restaurant List tab header and removed extra scrollbars on Wheel tab.
  - Removed Food Slots feature completely across HTML, CSS, JS, and project documentation.
- Mobile & Deployment Enhancements:
  - Published repository to GitHub ([VecetyP/I-Don-t-Know-What-To-Eat](https://github.com/VecetyP/I-Don-t-Know-What-To-Eat)).
  - Added `vercel.json` and `package.json` build scripts for Vercel deployment.
  - Fixed mobile touch scrolling by enabling `overflow-y: auto !important` and native `-webkit-overflow-scrolling: touch` under `@media (max-width: 1100px)`.

### 2026-07-23
- Resolved Google Maps JavaScript Engine initialization and `CONFIG` scope issues:
  - Added multi-source API key resolution (`config.js`, Vercel environment, and browser `LocalStorage` override).
  - Built an interactive **Google Maps Diagnostics Wrench Modal (🔧)** in the UI for real-time API status inspecting and key saving.
  - Built a standalone isolated diagnostic testing page `test_map.html`.
- Google Places API Multi-Page & Broad Search Enhancements:
  - Upgraded `fetchLiveGooglePlaces()` to handle Google Places API pagination (`pagination.nextPage()`), fetching up to 60+ real local dining spots.
  - Expanded search query keyword to `"food OR restaurant OR cafe OR dining"` to capture cafes, bakeries, food courts, and hawker centers.
  - Implemented dynamic GPS auto-anchoring in `recalculateDistances()` so mock/fallback venues adapt around user's phone GPS anywhere on Earth.
- UI Polish & Cleanups:
  - Removed "v2.0 Pro" badge and temporary "Quick Location" selection chips from `index.html`.

---

## Problems & Solutions

| Problem | Solution / Notes |
|---------|-----------------|
| Handling missing Google Maps API keys gracefully | Implemented a dedicated MapManager in `app.js` that checks for Google Maps loading status and automatically renders a beautiful, interactive SVG fallback map if the script fails to load or no key is provided. |
| Audio feedback without external MP3 asset dependency | Built a pure Web Audio API synthesizer in `app.js` that generates lightweight oscillator ticks, reel lock tones, and multi-note victory chimes directly in code. |
| Locked scrolling on mobile phones | Changed `html, body`, `.app-container`, and `.app-workspace` under mobile media queries to `overflow-y: auto !important`, `height: auto !important`, and `-webkit-overflow-scrolling: touch` to allow smooth native vertical scrolling on iOS and Android. |
| CORS block when running `config.js` locally | Built browser `LocalStorage` API key persistence so users can paste API keys directly into the UI without needing local file server setups or exposing keys in git. |

---

## Ideas & Future Features

- **Group Lobby Mode:** Allow friends to scan a QR code and join a collaborative voting lobby to pick a restaurant (requires a lightweight WebSocket backend).
- **Budget Gamification:** "Budget Challenge" modes to find the best-rated foods under $10.

---

## Links & Resources

- [[PROJECTS - README]]
- [Project Folder](file:///C:/Users/Thunn/OneDrive/Documents/Obsidian%20Vault/Ideaopolis/Projects/I%20Don't%20Know%20What%20to%20Eat)
- [Start Server Script](file:///C:/Users/Thunn/OneDrive/Documents/Obsidian%20Vault/Ideaopolis/Projects/I%20Don't%20Know%20What%20to%20Eat/start_server.bat)

---

*Folder: [[Projects/PROJECTS - README]]*
