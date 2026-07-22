---
project: I Don't Know What to Eat
status: 💡 Idea
tags:
  - restaurant-filter
  - projects
  - web-app
started: 2026-07-22
language: HTML, CSS, JavaScript
---

## What It Is

A premium, interactive restaurant discovery and filtering web application designed to solve the age-old dilemma of "What should we eat?". The app lets users pinpoint their location, apply advanced filters (cuisine, budget, distance, open-now status), view options on an interactive map using the Google Maps API, and spin a custom "Surprise Me" decision wheel when they are feeling indecisive.

---

## Goals

- [ ] Implement a premium glassmorphic dark-mode user interface with responsive side-by-side filter and map/list views.
- [ ] Integrate Google Maps JS API for location search, auto-complete, and marker mapping.
- [ ] Implement a fallback/mock interactive SVG-based map component when Google API keys are not supplied.
- [ ] Build a customizable "Surprise Me" selection wheel with smooth canvas spin animations and visual flair.
- [ ] Develop comprehensive client-side sorting and multi-criteria filtering (cuisine, distance, rating, budget).
- [ ] Build local storage capabilities to save favorite restaurants and past searches.

---

## Tech Stack

| Layer | Tool / Language |
|-------|----------------|
| Language | HTML5, CSS3 (Vanilla), JavaScript (ES6+) |
| Libraries | Google Maps JavaScript API, Lucide Icons (CDN) |
| Storage | LocalStorage (Favorites, History, Custom Places) |
| Platform | Client-side Web Application |

---

## Architecture / How It Works

The web application operates entirely client-side for ease of deployment and privacy:
1. **User Interface (`index.html` & `style.css`):** Formed using a modern glassmorphic layout, using custom CSS variables for dark-mode colors, neon accents, and fluid grid systems. Responsive behavior shifts from side-by-side desktop panels to stackable tabs on mobile.
2. **Core Logic (`app.js`):** Coordinates the application state:
   - **Google Maps Wrapper:** Safely handles Google Maps initialization, fallback maps, and address autocomplete.
   - **Filter Engine:** Performs fast client-side filtering on either fetched Google Places API results or an embedded local database of curated mock restaurants.
   - **Decision Engine:** Renders the customized selection wheel using HTML5 Canvas, executing physical deceleration math to pick a random venue.
3. **Configurations (`config.js`):** Separates user-specific configuration (like Google API keys) from application logic.

---

## Progress Log

### 2026-07-22
- Created the project directory `Projects/I Don't Know What to Eat` and structured base files.
- Initialized `I Don't Know What to Eat.md` project log and roadmap.
- Set up a robust `.gitignore` file to prevent committing API keys or environment configs.
- Built a premium glassmorphic frontend structure (`index.html`) with responsive sidebar filtering, search suggestions, visual map frame, and "Surprise Me" selection wheel interface.
- Developed styled components (`style.css`) using custom HSL colors, glassmorphism blur effects, micro-interactions, and spin animations.
- Created `app.js` containing mock data, location detection logic, visual SVG map placeholder, custom HTML5 Canvas wheel spin animator, and client-side query filter algorithms.
- Configured a local test runner script (`start_server.bat`) using Python's http server module for instant development verification.

---

## Problems & Solutions

| Problem | Solution / Notes |
|---------|-----------------|
| Handling missing Google Maps API keys gracefully | Implemented a dedicated MapManager in `app.js` that checks for Google Maps loading status and automatically renders a beautiful, interactive SVG fallback map if the script fails to load or no key is provided. |

---

## Ideas & Future Features

- **Group Lobby Mode:** Allow friends to scan a QR code and join a collaborative voting lobby to pick a restaurant (requires a lightweight WebSocket backend).
- **Dietary Restriction Profiles:** Save profiles (e.g., Vegan, Gluten-Free, Halal) to auto-apply exclusions.
- **Budget Gamification:** "Budget Challenge" modes to find the best-rated foods under $10.

---

## Links & Resources

- [[PROJECTS - README]]
- [Project Folder](file:///C:/Users/Thunn/OneDrive/Documents/Obsidian%20Vault/Ideaopolis/Projects/I%20Don't%20Know%20What%20to%20Eat)
- [Start Server Script](file:///C:/Users/Thunn/OneDrive/Documents/Obsidian%20Vault/Ideaopolis/Projects/I%20Don't%20Know%20What%20to%20Eat/start_server.bat)

---

*Folder: [[Projects/PROJECTS - README]]*
