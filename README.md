# I Don't Know What to Eat

An interactive restaurant discoverability and filtering web application designed to solve the age-old dilemma of deciding where to eat.

## Features
- **Location-Based Recommendations:** Automatic IP or browser Geolocation detection to center local dining options.
- **Advanced Filtering & Sorting:** Narrow down choices by cuisine type, price point, rating, distance, and current operating hours.
- **Restaurant Roulette:** A decision wheel that dynamically picks a restaurant for you.
- **Google Maps Integration:** Renders map pins, info-windows, and search autocomplete via the Google Maps JavaScript API

## How to Run Locally

### 1. Launch Server
Run the local launcher script:
```powershell
./start_server.bat
```
Alternatively, spin up a lightweight server manually:
```powershell
python -m http.server 8000
```
Then navigate to [http://localhost:8000](http://localhost:8000) in your web browser.

### 2. Configure Google Maps API (Optional)
To use real live restaurant data and coordinates instead of mock data:
1. Copy `config.example.js` to `config.js`.
2. Add your Google Maps API key (with Geolocation, Places, and Maps Javascript API enabled) inside `config.js`:
   ```javascript
   const CONFIG = {
     GOOGLE_MAPS_API_KEY: "YOUR_API_KEY_HERE"
   };
   ```
