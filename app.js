/**
 * I Don't Know What to Eat — Main Application Logic
 * Implements Google Maps API integration, Fallback Interactive SVG Maps,
 * Dynamic Multi-Criteria Filtering, and Canvas-based Restaurant Roulette Wheel.
 */

// ==========================================================================
// 1. Mock Database (Default fallback and demo data)
// ==========================================================================
const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "Bella Pasta & Grill",
    cuisine: "Italian",
    price: 3,
    rating: 4.7,
    distance: 1.2,
    open: true,
    lat: 1.2932,
    lng: 103.8530,
    address: "18 Marina Boulevard, Tower 2, Singapore 018981",
    phone: "+65 6543 2109",
    description: "Artisanal wood-fired pizzas, homemade creamy pastas, and traditional tiramisu served in a cozy, upscale glass-walled setting."
  },
  {
    id: 2,
    name: "Sakura Sushi Zen",
    cuisine: "Japanese",
    price: 4,
    rating: 4.8,
    distance: 0.8,
    open: true,
    lat: 1.2885,
    lng: 103.8558,
    address: "8 Raffles Avenue, Esplanade Mall #02-14, Singapore 039802",
    phone: "+65 6987 6543",
    description: "Ultra-fresh premium sashimi, dynamic hand-rolled maki, and tailored omakase dining courses flown in daily from Tokyo."
  },
  {
    id: 3,
    name: "The Burger Refinery",
    cuisine: "American",
    price: 2,
    rating: 4.4,
    distance: 1.9,
    open: true,
    lat: 1.2950,
    lng: 103.8480,
    address: "25 North Bridge Road, #01-03, Singapore 179104",
    phone: "+65 6321 0987",
    description: "Juicy dry-aged wagyu beef smash patties, truffle parmesan fires, and decadent double-thick milkshakes."
  },
  {
    id: 4,
    name: "Bangkok Street Eats",
    cuisine: "Thai",
    price: 1,
    rating: 4.2,
    distance: 2.3,
    open: false,
    lat: 1.2830,
    lng: 103.8450,
    address: "101 Upper Cross Street, People's Park Complex, Singapore 058357",
    phone: "+65 6123 4567",
    description: "Fiery green curries, traditional Pad Thai, and sweet mango sticky rice served hot and fast straight from wok to table."
  },
  {
    id: 5,
    name: "La Cantina Taqueria",
    cuisine: "Mexican",
    price: 2,
    rating: 4.5,
    distance: 1.5,
    open: true,
    lat: 1.2860,
    lng: 103.8475,
    address: "36 Club Street, Singapore 069469",
    phone: "+65 6789 0123",
    description: "Sizzling street tacos, fresh hand-smashed guacamole, and crisp margaritas in a colorful, high-energy environment."
  },
  {
    id: 6,
    name: "Aroma Brew Cafe",
    cuisine: "Cafe",
    price: 2,
    rating: 4.3,
    distance: 0.6,
    open: true,
    lat: 1.2915,
    lng: 103.8505,
    address: "10 Beach Road, #01-01, Singapore 189673",
    phone: "+65 6654 3210",
    description: "Single-origin pour-overs, fluffy matcha croissants, and artisanal brunch favorites under hanging garden lights."
  },
  {
    id: 7,
    name: "Spice Palace",
    cuisine: "Indian",
    price: 3,
    rating: 4.6,
    distance: 3.1,
    open: true,
    lat: 1.3050,
    lng: 103.8525,
    address: "128 Serangoon Road, Little India, Singapore 218033",
    phone: "+65 6876 5432",
    description: "Fragrant saffron biryani, buttery garlic naans, and rich tandoori grills marinated in secret generational spice blends."
  },
  {
    id: 8,
    name: "Noodle House Express",
    cuisine: "Chinese",
    price: 1,
    rating: 4.1,
    distance: 2.8,
    open: true,
    lat: 1.2980,
    lng: 103.8420,
    address: "12 Eu Tong Sen Street, Clarke Quay, Singapore 059819",
    phone: "+65 6432 1098",
    description: "Hand-pulled Lanzhou ramen and steamed pork xiaolongbao served hot in a bustling fast-casual marketplace."
  }
];

// Map Coordinate Limits for Interactive SVG Mock Map
const SVG_MAP_BOUNDS = {
  minLat: 1.2800,
  maxLat: 1.3100,
  minLng: 103.8400,
  maxLng: 103.8600
};

// ==========================================================================
// 2. Application State variables
// ==========================================================================
let state = {
  userLocation: { lat: 1.29027, lng: 103.85195 }, // Downtown Core Singapore
  restaurants: [...MOCK_RESTAURANTS],
  filtered: [],
  selectedRestaurant: null,
  activeCuisine: "all",
  activePrices: [1, 2, 3, 4],
  minRating: 4.0,
  maxRadius: 2.5,
  openNowOnly: true,
  searchQuery: "",
  googleMap: null,
  googleMarkers: [],
  googleAutocomplete: null,
  isSpinning: false
};

// ==========================================================================
// 3. Initialization & Event Bindings
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();
  
  // Set up Event Listeners
  setupEventListeners();
  
  // Try to load user location (geolocation API)
  detectUserLocation();
  
  // Try to load Google Maps Script
  loadGoogleMapsScript();
  
  // Set default filter state inputs
  syncDOMInputs();
  
  // Run first calculation and render loop
  applyFilters();
});

function syncDOMInputs() {
  document.getElementById("radiusSlider").value = state.maxRadius;
  document.getElementById("radiusValue").innerText = `${state.maxRadius} km`;
  
  document.getElementById("ratingSlider").value = state.minRating;
  document.getElementById("ratingValue").innerText = `${state.minRating.toFixed(1)} ★`;
  
  document.getElementById("openNowCheck").checked = state.openNowOnly;
  document.getElementById("searchInput").value = state.searchQuery || "Downtown Core";
}

function setupEventListeners() {
  // Radius Slider
  const radiusSlider = document.getElementById("radiusSlider");
  radiusSlider.addEventListener("input", (e) => {
    state.maxRadius = parseFloat(e.target.value);
    document.getElementById("radiusValue").innerText = `${state.maxRadius} km`;
    applyFilters();
  });

  // Rating Slider
  const ratingSlider = document.getElementById("ratingSlider");
  ratingSlider.addEventListener("input", (e) => {
    state.minRating = parseFloat(e.target.value);
    document.getElementById("ratingValue").innerText = `${state.minRating.toFixed(1)} ★`;
    applyFilters();
  });

  // Open Now Switch
  const openNowCheck = document.getElementById("openNowCheck");
  openNowCheck.addEventListener("change", (e) => {
    state.openNowOnly = e.target.checked;
    applyFilters();
  });

  // Search input and trigger button
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  
  const triggerSearch = () => {
    state.searchQuery = searchInput.value.trim().toLowerCase();
    applyFilters();
  };
  
  searchBtn.addEventListener("click", triggerSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") triggerSearch();
  });

  // Price buttons toggle
  const priceSelector = document.getElementById("priceSelector");
  priceSelector.addEventListener("click", (e) => {
    if (e.target.classList.contains("price-btn")) {
      const priceVal = parseInt(e.target.getAttribute("data-price"));
      if (state.activePrices.includes(priceVal)) {
        // Remove if we have at least one other price active
        if (state.activePrices.length > 1) {
          state.activePrices = state.activePrices.filter(p => p !== priceVal);
          e.target.classList.remove("active");
        }
      } else {
        // Add
        state.activePrices.push(priceVal);
        e.target.classList.add("active");
      }
      applyFilters();
    }
  });

  // Cuisine Tags selector
  const cuisineTags = document.getElementById("cuisineTags");
  cuisineTags.addEventListener("click", (e) => {
    if (e.target.classList.contains("tag-btn")) {
      // Deactivate siblings
      cuisineTags.querySelectorAll(".tag-btn").forEach(btn => btn.classList.remove("active"));
      // Activate this one
      e.target.classList.add("active");
      state.activeCuisine = e.target.getAttribute("data-cuisine");
      applyFilters();
    }
  });

  // Tab Links
  const tabs = document.querySelectorAll(".viewer-tabs .tab-link");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const targetTabId = tab.getAttribute("data-tab");
      document.querySelectorAll(".viewer-panel .tab-content").forEach(content => {
        content.classList.remove("active");
      });
      document.getElementById(targetTabId).classList.add("active");

      // Draw wheel if shifting to wheel tab
      if (targetTabId === "wheelView") {
        drawWheel();
      }
    });
  });

  // Spin Roulette triggers
  const surpriseBtn = document.getElementById("surpriseBtn");
  surpriseBtn.addEventListener("click", () => {
    // Force transition to wheel tab
    document.getElementById("wheelTabBtn").click();
    setTimeout(spinWheel, 300);
  });

  const spinWheelBtn = document.getElementById("spinWheelBtn");
  spinWheelBtn.addEventListener("click", spinWheel);

  // Close modals
  document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  document.getElementById("winnerModal").addEventListener("click", (e) => {
    if (e.target.id === "winnerModal") closeModal();
  });

  document.getElementById("spinAgainBtn").addEventListener("click", () => {
    closeModal();
    spinWheel();
  });

  document.getElementById("navigateBtn").addEventListener("click", navigateToWinner);
}

// ==========================================================================
// 4. Geolocation Detection
// ==========================================================================
function detectUserLocation() {
  const badgeText = document.getElementById("locationText");
  const badge = document.getElementById("locationStatus");
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.userLocation.lat = position.coords.latitude;
        state.userLocation.lng = position.coords.longitude;
        
        badge.classList.add("active-gps");
        badgeText.innerText = "GPS Verified Location";
        
        // Regenerate mock coordinate offsets based on real coordinates so details match
        recalculateDistances();
        applyFilters();
      },
      (error) => {
        console.warn("Geolocation permission denied. Defaulting to Downtown Singapore coordinates.", error);
        badge.classList.remove("active-gps");
        badgeText.innerText = "Downtown Core (Default)";
      }
    );
  } else {
    badgeText.innerText = "Geolocation Unresolved";
  }
}

function recalculateDistances() {
  // Simple haversine-like or coordinate estimation approximation
  state.restaurants.forEach(rest => {
    const dLat = rest.lat - state.userLocation.lat;
    const dLng = rest.lng - state.userLocation.lng;
    const distKm = Math.sqrt(dLat*dLat + dLng*dLng) * 111.32; // Rough KM calculation
    rest.distance = parseFloat(distKm.toFixed(1));
  });
}

// ==========================================================================
// 5. Dynamic Filtering Logic
// ==========================================================================
function applyFilters() {
  state.filtered = state.restaurants.filter(rest => {
    // Cuisine Filter
    if (state.activeCuisine !== "all" && rest.cuisine !== state.activeCuisine) return false;
    
    // Price Filter
    if (!state.activePrices.includes(rest.price)) return false;
    
    // Rating Filter
    if (rest.rating < state.minRating) return false;
    
    // Distance Filter
    if (rest.distance > state.maxRadius) return false;
    
    // Open status Filter
    if (state.openNowOnly && !rest.open) return false;
    
    // Keyword/Search text search
    if (state.searchQuery) {
      const matchName = rest.name.toLowerCase().includes(state.searchQuery);
      const matchCuisine = rest.cuisine.toLowerCase().includes(state.searchQuery);
      const matchDesc = rest.description.toLowerCase().includes(state.searchQuery);
      if (!matchName && !matchCuisine && !matchDesc) return false;
    }
    
    return true;
  });

  // Sort by rating & proximity by default
  state.filtered.sort((a, b) => b.rating - a.rating);

  // Update Counters
  document.getElementById("matchCount").innerText = state.filtered.length;
  document.getElementById("wheelCountText").innerText = state.filtered.length;

  // Render components
  renderRestaurantCards();
  renderMapMarkers();
  
  // Re-draw wheel if visible
  if (document.getElementById("wheelView").classList.contains("active")) {
    drawWheel();
  }
}

// ==========================================================================
// 6. Rendering List view
// ==========================================================================
function renderRestaurantCards() {
  const container = document.getElementById("restaurantList");
  container.innerHTML = "";

  if (state.filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-list-panel glass-panel" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; gap: 12px; height: 200px;">
        <i data-lucide="frown" style="width: 48px; height: 48px; color: var(--text-dim);"></i>
        <h3 style="font-family: var(--font-display);">No restaurants match filters</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Try widening your distance radius or selecting more cuisines.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  state.filtered.forEach(rest => {
    const card = document.createElement("div");
    card.className = "restaurant-card glass-panel";
    card.addEventListener("click", () => showWinnerDetails(rest));

    const priceString = "$".repeat(rest.price);
    const statusText = rest.open ? "Open Now" : "Closed";
    const statusClass = rest.open ? "open" : "closed";

    card.innerHTML = `
      <div class="card-top">
        <span class="cuisine-badge">${rest.cuisine}</span>
        <span class="rating-badge"><i data-lucide="star"></i> ${rest.rating.toFixed(1)}</span>
      </div>
      <div class="card-body">
        <div>
          <h4>${rest.name}</h4>
          <p class="desc">${rest.description}</p>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-footer-info">
          <span><i data-lucide="navigation"></i> ${rest.distance} km</span>
          <span><i data-lucide="dollar-sign"></i> ${priceString}</span>
        </div>
        <div class="status-indicator ${statusClass}">${statusText}</div>
      </div>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

// ==========================================================================
// 7. Map Rendering (Google Maps or Custom SVG Interactive Fallback)
// ==========================================================================
function loadGoogleMapsScript() {
  // Check if configuration has a google API key
  const hasKey = typeof CONFIG !== "undefined" && CONFIG.GOOGLE_MAPS_API_KEY;
  
  if (hasKey) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error("Failed to load Google Maps script. Loading fallback SVG map.");
      initFallbackMap();
    };
    document.head.appendChild(script);
  } else {
    // If no API Key is available, initialize Fallback SVG Map
    initFallbackMap();
  }
}

// Triggered by JSONP callback on google maps script load
window.initGoogleMap = function() {
  document.getElementById("fallbackMap").style.display = "none";
  
  const mapElement = document.getElementById("googleMap");
  
  // Create Google Map
  state.googleMap = new google.maps.Map(mapElement, {
    center: state.userLocation,
    zoom: 15,
    styles: GOOGLE_MAP_DARK_STYLES, // Apply premium sleek dark-mode styles
    disableDefaultUI: true,
    zoomControl: true
  });

  // User Marker
  new google.maps.Marker({
    position: state.userLocation,
    map: state.googleMap,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: "#06b6d4",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2
    },
    title: "Your Location"
  });

  // Set up search box autocomplete
  const searchInput = document.getElementById("searchInput");
  state.googleAutocomplete = new google.maps.places.Autocomplete(searchInput);
  state.googleAutocomplete.bindTo("bounds", state.googleMap);
  
  state.googleAutocomplete.addListener("place_changed", () => {
    const place = state.googleAutocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    
    // Center map and update user coordinate simulation
    state.userLocation.lat = place.geometry.location.lat();
    state.userLocation.lng = place.geometry.location.lng();
    state.googleMap.setCenter(state.userLocation);
    state.googleMap.setZoom(15);
    
    recalculateDistances();
    applyFilters();
  });

  // Force render initial markers
  renderMapMarkers();
};

function renderMapMarkers() {
  // If Google Maps is active
  if (state.googleMap) {
    // Clear old markers
    state.googleMarkers.forEach(m => m.setMap(null));
    state.googleMarkers = [];

    // Add new ones
    state.filtered.forEach(rest => {
      const marker = new google.maps.Marker({
        position: { lat: rest.lat, lng: rest.lng },
        map: state.googleMap,
        title: rest.name,
        animation: google.maps.Animation.DROP
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="color:#000; font-family:sans-serif; padding:4px;">
          <strong>${rest.name}</strong><br>
          ${rest.cuisine} • ${rest.rating.toFixed(1)} ★<br>
          <a href="#" onclick="window.showDetailsFromMap(${rest.id}); return false;" style="color:var(--primary); font-weight:600; text-decoration:none;">View Details</a>
        </div>`
      });

      marker.addListener("click", () => {
        infoWindow.open(state.googleMap, marker);
      });

      state.googleMarkers.push(marker);
    });
  } else {
    // Update Fallback SVG Map elements
    updateFallbackSvgMarkers();
  }
}

// Global hook for Map Info Window clicks
window.showDetailsFromMap = function(id) {
  const restaurant = state.restaurants.find(r => r.id === id);
  if (restaurant) showWinnerDetails(restaurant);
};

// Fallback Map: Draws a sleek layout inside vector canvas
function initFallbackMap() {
  document.getElementById("googleMap").style.display = "none";
  document.getElementById("fallbackMap").style.display = "flex";

  const svg = document.getElementById("svgMap");
  svg.innerHTML = ""; // Clear

  // 1. Draw Park/Water Areas
  svg.innerHTML += `
    <rect width="800" height="500" fill="#11141b" />
    <path class="svg-park" d="M 0,0 L 250,0 L 180,120 L 50,180 Z" />
    <path class="svg-park" d="M 600,380 L 800,320 L 800,500 L 550,500 Z" />
    <path class="svg-river" d="M -50,400 Q 200,350 400,200 T 850,50" />
  `;

  // 2. Draw Roads (grid-like layout)
  svg.innerHTML += `
    <path class="svg-road" d="M 100,-20 L 100,520" />
    <path class="svg-road" d="M 300,-20 L 300,520" />
    <path class="svg-road" d="M 500,-20 L 500,520" />
    <path class="svg-road" d="M 700,-20 L 700,520" />
    <path class="svg-road" d="M -20,100 L 820,100" />
    <path class="svg-road" d="M -20,280 L 820,280" />
    <path class="svg-road" d="M -20,420 L 820,420" />
  `;

  // 3. Draw User node
  // Center is mapped to 400, 250 in SVG coordinates
  const userX = 400;
  const userY = 250;

  svg.innerHTML += `
    <circle class="user-pulse" cx="${userX}" cy="${userY}" r="30" />
    <circle class="user-pulse" cx="${userX}" cy="${userY}" r="15" />
    <circle class="user-node" cx="${userX}" cy="${userY}" r="7" />
  `;

  // Create Marker Group
  const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  markerGroup.id = "svgMarkerGroup";
  svg.appendChild(markerGroup);

  // Initial draw
  updateFallbackSvgMarkers();
}

function updateFallbackSvgMarkers() {
  const markerGroup = document.getElementById("svgMarkerGroup");
  if (!markerGroup) return;
  
  markerGroup.innerHTML = ""; // Clear

  state.filtered.forEach(rest => {
    // Project Latitude/Longitude coordinates onto SVG screen bounds (800x500)
    const x = ((rest.lng - SVG_MAP_BOUNDS.minLng) / (SVG_MAP_BOUNDS.maxLng - SVG_MAP_BOUNDS.minLng)) * 800;
    // Note: Latitudes increase upwards, but screen coordinates increase downwards
    const y = 500 - (((rest.lat - SVG_MAP_BOUNDS.minLat) / (SVG_MAP_BOUNDS.maxLat - SVG_MAP_BOUNDS.minLat)) * 500);

    // Create marker pin group
    const pin = document.createElementNS("http://www.w3.org/2000/svg", "g");
    pin.setAttribute("class", "svg-pin");
    pin.setAttribute("transform", `translate(${x}, ${y})`);
    pin.addEventListener("click", () => showWinnerDetails(rest));

    // Pin vector drawing and pulse
    pin.innerHTML = `
      <circle class="svg-pin-pulse" cx="0" cy="0" r="12" />
      <!-- Pointer Icon -->
      <path d="M 0,0 C -5,-8 -10,-14 -10,-20 C -10,-26 -5,-30 0,-30 C 5,-30 10,-26 10,-20 C 10,-14 5,-8 0,0 Z" />
      <circle cx="0" cy="-20" r="4" fill="#ffffff" />
    `;

    markerGroup.appendChild(pin);
  });
}

// Sleek dark-mode styling variables for Google Map loading
const GOOGLE_MAP_DARK_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#11141b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#11141b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#74808a" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#c8d0d6" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#a5b4fc" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#14231b" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1b202c" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2d3748" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#312e81" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1e1b4b" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#e0e7ff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#162a3f" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4b5563" }] }
];

// ==========================================================================
// 8. Roulette Wheel decision engine (HTML5 Canvas)
// ==========================================================================
let wheelState = {
  angle: 0,
  speed: 0,
  deceleration: 0.985,
  sliceAngle: 0
};

function drawWheel() {
  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  const count = state.filtered.length;

  // Clear Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (count === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.arc(225, 225, 200, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "var(--text-muted)";
    ctx.font = "bold 16px Outfit";
    ctx.textAlign = "center";
    ctx.fillText("No restaurants loaded", 225, 220);
    ctx.font = "13px Plus Jakarta Sans";
    ctx.fillText("Add items to spin", 225, 240);
    return;
  }

  const radius = 200;
  const centerX = 225;
  const centerY = 225;
  const sliceAngle = (2 * Math.PI) / count;
  wheelState.sliceAngle = sliceAngle;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(wheelState.angle);

  for (let i = 0; i < count; i++) {
    const item = state.filtered[i];
    const currentAngle = i * sliceAngle;

    // Outer Sector Colors (Alternate neon palettes)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();

    // Palette generator using HSL
    const hue = (parseInt(varColorFromString(item.cuisine)) + (i * 30)) % 360;
    ctx.fillStyle = `hsl(${hue}, 65%, 28%)`;
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw Texts
    ctx.save();
    ctx.rotate(currentAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Outfit";
    
    // Truncate restaurant name if too long for slice
    let label = item.name;
    if (label.length > 18) label = label.slice(0, 16) + "...";
    ctx.fillText(label, radius - 15, 5);
    ctx.restore();
  }

  // Draw inner ring border
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.stroke();

  ctx.restore();

  // Draw core overlay
  ctx.beginPath();
  ctx.arc(centerX, centerY, 42, 0, 2 * Math.PI);
  ctx.fillStyle = "#1b202c";
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0; // Reset shadow
}

// Helper to assign a deterministic color code based on text (Cuisine type)
function varColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
}

function spinWheel() {
  if (state.filtered.length === 0 || state.isSpinning) return;
  
  state.isSpinning = true;
  document.getElementById("spinWheelBtn").disabled = true;
  document.getElementById("surpriseBtn").disabled = true;

  // Set initial random speed & deceleration rate
  wheelState.speed = 0.3 + Math.random() * 0.4; // Initial velocity rads/frame
  wheelState.deceleration = 0.982 + Math.random() * 0.005;

  animateSpin();
}

function animateSpin() {
  if (wheelState.speed > 0.001) {
    wheelState.angle += wheelState.speed;
    wheelState.speed *= wheelState.deceleration;
    drawWheel();
    requestAnimationFrame(animateSpin);
  } else {
    // Decelerated to stop. Detect landing restaurant item
    state.isSpinning = false;
    document.getElementById("spinWheelBtn").disabled = false;
    document.getElementById("surpriseBtn").disabled = false;
    
    // Normalize target landing sector
    const totalRotation = wheelState.angle % (2 * Math.PI);
    
    // The pointer sits at top (-Math.PI/2 / 270 degrees)
    // Finding index relative to spinning rotation directions
    const pointerOffsetAngle = (3 / 2) * Math.PI; 
    let relativeAngle = pointerOffsetAngle - totalRotation;
    while (relativeAngle < 0) relativeAngle += 2 * Math.PI;
    
    const landingIndex = Math.floor(relativeAngle / wheelState.sliceAngle) % state.filtered.length;
    
    // Trigger modal detail view
    const winner = state.filtered[landingIndex];
    showWinnerDetails(winner);
  }
}

// ==========================================================================
// 9. Details Modal Management
// ==========================================================================
function showWinnerDetails(restaurant) {
  state.selectedRestaurant = restaurant;
  
  document.getElementById("winnerCuisine").innerText = restaurant.cuisine;
  document.getElementById("winnerName").innerText = restaurant.name;
  document.getElementById("winnerRating").innerText = restaurant.rating.toFixed(1);
  
  // Render dollar signs for pricing
  document.getElementById("winnerPrice").innerText = "$".repeat(restaurant.price);
  document.getElementById("winnerDistance").innerText = `${restaurant.distance} km away`;
  document.getElementById("winnerDescription").innerText = restaurant.description;
  document.getElementById("winnerHours").innerText = restaurant.open ? "Open Now (Closes 10:00 PM)" : "Closed (Opens Tomorrow)";
  document.getElementById("winnerAddress").innerText = restaurant.address;
  document.getElementById("winnerPhone").innerText = restaurant.phone;

  // Trigger modal display
  const modal = document.getElementById("winnerModal");
  modal.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("winnerModal");
  modal.classList.remove("active");
  state.selectedRestaurant = null;
}

function navigateToWinner() {
  if (!state.selectedRestaurant) return;
  const addressQuery = encodeURIComponent(state.selectedRestaurant.address);
  // Opens maps directions
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`, "_blank");
}
