/**
 * I Don't Know What to Eat — Master Application Engine (v2.0 Pro)
 * Features:
 * - Multi-Mode Decision Suite (Wheel of Fortune, Food Slot Machine, Food Battle Tournament)
 * - Google Maps API + Interactive Vector Radar Map Fallback (Zoom/Pan/Preview Cards)
 * - Dynamic Multi-Criteria Filter Engine (Cuisines, Price, Rating, Radius, Open Now, Dietary Badges, Sorting)
 * - Web Audio API Synthesized Sound Effects (Ticks, Reel Locks, Victory Chime)
 * - Canvas Confetti Particle FX & LocalStorage Persistence (Favorites, Custom Venues)
 */

// ==========================================================================
// 1. Initial Mock Database & Storage Keys
// ==========================================================================
const STORAGE_FAVS_KEY = "idk_what_to_eat_favs_v2";
const STORAGE_CUSTOM_KEY = "idk_what_to_eat_custom_v2";

const INITIAL_MOCK_RESTAURANTS = [
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
    description: "Artisanal wood-fired pizzas, homemade creamy pastas, and tiramisu served in an upscale glass setting.",
    dietary: ["vegetarian"]
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
    description: "Ultra-fresh premium sashimi, dynamic hand-rolled maki, and omakase courses flown in daily from Tokyo.",
    dietary: ["halal"]
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
    description: "Juicy dry-aged wagyu beef smash patties, truffle parmesan fries, and double-thick milkshakes.",
    dietary: ["halal", "glutenFree"]
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
    description: "Fiery green curries, traditional Pad Thai, and sweet mango sticky rice served hot straight from wok to table.",
    dietary: ["halal", "vegetarian"]
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
    description: "Sizzling street tacos, fresh hand-smashed guacamole, and crisp margaritas in a colorful environment.",
    dietary: ["glutenFree", "vegan", "vegetarian"]
  },
  {
    id: 6,
    name: "Aroma Brew Cafe & Bakery",
    cuisine: "Cafe",
    price: 2,
    rating: 4.3,
    distance: 0.6,
    open: true,
    lat: 1.2915,
    lng: 103.8505,
    address: "10 Beach Road, #01-01, Singapore 189673",
    phone: "+65 6654 3210",
    description: "Single-origin pour-overs, fluffy matcha croissants, and artisanal brunch favorites under hanging lights.",
    dietary: ["vegetarian", "vegan"]
  },
  {
    id: 7,
    name: "Spice Palace Tandoori",
    cuisine: "Indian",
    price: 3,
    rating: 4.6,
    distance: 3.1,
    open: true,
    lat: 1.3050,
    lng: 103.8525,
    address: "128 Serangoon Road, Little India, Singapore 218033",
    phone: "+65 6876 5432",
    description: "Fragrant saffron biryani, buttery garlic naans, and rich tandoori grills marinated in secret generational spice blends.",
    dietary: ["halal", "vegetarian", "vegan"]
  },
  {
    id: 8,
    name: "Golden Lantern Noodle Bar",
    cuisine: "Chinese",
    price: 1,
    rating: 4.3,
    distance: 2.8,
    open: true,
    lat: 1.2980,
    lng: 103.8420,
    address: "12 Eu Tong Sen Street, Clarke Quay, Singapore 059819",
    phone: "+65 6432 1098",
    description: "Hand-pulled Lanzhou beef ramen and delicate steamed pork xiaolongbao served hot in a vibrant hall.",
    dietary: ["halal"]
  },
  {
    id: 9,
    name: "Zen Garden Veggie House",
    cuisine: "Cafe",
    price: 2,
    rating: 4.6,
    distance: 1.1,
    open: true,
    lat: 1.2895,
    lng: 103.8490,
    address: "50 Telok Ayer Street, Singapore 048441",
    phone: "+65 6222 8899",
    description: "Plant-based Asian fusion bowls, organic cold-pressed juices, and gluten-free pastries.",
    dietary: ["vegan", "vegetarian", "glutenFree"]
  },
  {
    id: 10,
    name: "Tokyo Ramen Yatai",
    cuisine: "Japanese",
    price: 2,
    rating: 4.7,
    distance: 0.9,
    open: true,
    lat: 1.2940,
    lng: 103.8540,
    address: "9 Raffles Boulevard, Millenia Walk #01-20, Singapore 039596",
    phone: "+65 6333 4455",
    description: "Rich 16-hour simmered tonkotsu broth, springy noodles, and melt-in-your-mouth chashu pork.",
    dietary: []
  }
];

const SVG_MAP_BOUNDS = {
  minLat: 1.2800,
  maxLat: 1.3100,
  minLng: 103.8400,
  maxLng: 103.8600
};

// ==========================================================================
// 2. Global State Object
// ==========================================================================
let state = {
  userLocation: { lat: 1.29027, lng: 103.85195 },
  restaurants: [],
  filtered: [],
  favorites: [],
  selectedRestaurant: null,
  
  // Filter criteria
  activeCuisine: "all",
  activePrices: [1, 2, 3, 4],
  activeDiets: [],
  activePreset: null,
  minRating: 4.0,
  maxRadius: 2.5,
  openNowOnly: true,
  searchQuery: "",
  sortBy: "rating",
  
  // Audio & Settings
  soundEnabled: true,
  
  // Maps & UI
  googleMap: null,
  googleMarkers: [],
  googleAutocomplete: null,
  mapZoomLevel: 1,
  
  // Decision Engines
  isSpinning: false,
  battleCandidates: [],
  battleRound: 1
};

// Google Maps Dark Style Preset
const GOOGLE_MAP_DARK_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0f131a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f131a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#74808a" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#c8d0d6" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#a5b4fc" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#13271d" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1b212f" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#252e42" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#312e81" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#132a42" }] }
];

// Audio Synthesizer Context
let audioCtx = null;

// ==========================================================================
// 3. Application Lifecycle & Entry Point
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();
  
  // Load LocalStorage persisted data
  loadPersistedData();
  
  // Setup event listeners
  setupEventListeners();
  
  // Detect location
  detectUserLocation();
  
  // Load Google Maps if API key is present in config.js
  loadGoogleMapsScript();
  
  // Synchronize inputs & apply initial filter
  syncDOMInputs();
  applyFilters();
});

function loadPersistedData() {
  // Favorites
  try {
    const savedFavs = localStorage.getItem(STORAGE_FAVS_KEY);
    if (savedFavs) state.favorites = JSON.parse(savedFavs);
  } catch (e) {
    state.favorites = [];
  }
  
  // Custom user added restaurants
  let customSpots = [];
  try {
    const savedCustom = localStorage.getItem(STORAGE_CUSTOM_KEY);
    if (savedCustom) customSpots = JSON.parse(savedCustom);
  } catch (e) {
    customSpots = [];
  }
  
  state.restaurants = [...INITIAL_MOCK_RESTAURANTS, ...customSpots];
  updateFavBadgeCounts();
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_FAVS_KEY, JSON.stringify(state.favorites));
  } catch (e) {}
  updateFavBadgeCounts();
}

function saveCustomSpots(spot) {
  let customSpots = [];
  try {
    const saved = localStorage.getItem(STORAGE_CUSTOM_KEY);
    if (saved) customSpots = JSON.parse(saved);
  } catch (e) {}
  
  customSpots.push(spot);
  localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customSpots));
}

function updateFavBadgeCounts() {
  const count = state.favorites.length;
  document.getElementById("favCountHeader").innerText = count;
  document.getElementById("favCountTab").innerText = count;
}

// ==========================================================================
// 4. Web Audio API Sound Synthesizer
// ==========================================================================
function playAudioTick() {
  if (!state.soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {}
}

function playVictoryChime() {
  if (!state.soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const startTime = audioCtx.currentTime + idx * 0.08;
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch (e) {}
}

// ==========================================================================
// 5. Canvas Confetti Particles
// ==========================================================================
function launchConfettiBurst() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ["#f43f5e", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
  
  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2 - 50,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }
  
  let frame = 0;
  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;
    
    particles.forEach(p => {
      if (p.opacity > 0) {
        activeParticles++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.rotation += p.rSpeed;
        p.opacity -= 0.015;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });
    
    frame++;
    if (activeParticles > 0 && frame < 120) {
      requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  animateConfetti();
}

// ==========================================================================
// 6. DOM Synchronization & Event Listeners
// ==========================================================================
function syncDOMInputs() {
  document.getElementById("radiusSlider").value = state.maxRadius;
  document.getElementById("radiusValue").innerText = `${state.maxRadius} km`;
  
  document.getElementById("ratingSlider").value = state.minRating;
  document.getElementById("ratingValue").innerText = `${state.minRating.toFixed(1)} ★`;
  
  document.getElementById("openNowCheck").checked = state.openNowOnly;
  document.getElementById("sortSelect").value = state.sortBy;
}

function setupEventListeners() {
  // Sound Toggle
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  soundToggleBtn.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    soundToggleBtn.classList.toggle("active", state.soundEnabled);
    const soundIcon = document.getElementById("soundIcon");
    const soundLabel = soundToggleBtn.querySelector(".sound-label");
    
    if (state.soundEnabled) {
      soundIcon.setAttribute("data-lucide", "volume-2");
      soundLabel.innerText = "Audio On";
      playAudioTick();
    } else {
      soundIcon.setAttribute("data-lucide", "volume-x");
      soundLabel.innerText = "Muted";
    }
    lucide.createIcons();
  });

  // Relocate / GPS refresh
  document.getElementById("relocateBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    detectUserLocation();
  });

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
  document.getElementById("openNowCheck").addEventListener("change", (e) => {
    state.openNowOnly = e.target.checked;
    applyFilters();
  });

  // Search Bar
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const searchBtn = document.getElementById("searchBtn");
  
  const triggerSearch = () => {
    state.searchQuery = searchInput.value.trim().toLowerCase();
    clearSearchBtn.classList.toggle("hidden", state.searchQuery === "");
    applyFilters();
  };
  
  searchBtn.addEventListener("click", triggerSearch);
  searchInput.addEventListener("input", () => {
    clearSearchBtn.classList.toggle("hidden", searchInput.value === "");
  });
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") triggerSearch();
  });
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    state.searchQuery = "";
    clearSearchBtn.classList.add("hidden");
    applyFilters();
  });

  // Quick Preset Chips
  document.querySelectorAll(".preset-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const preset = chip.getAttribute("data-preset");
      if (state.activePreset === preset) {
        state.activePreset = null;
        chip.classList.remove("active");
      } else {
        document.querySelectorAll(".preset-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.activePreset = preset;
      }
      applyPresetFilter();
    });
  });

  // Reset Filters
  document.getElementById("resetFiltersBtn").addEventListener("click", () => {
    state.activeCuisine = "all";
    state.activePrices = [1, 2, 3, 4];
    state.activeDiets = [];
    state.activePreset = null;
    state.minRating = 1.0;
    state.maxRadius = 10.0;
    state.openNowOnly = false;
    state.searchQuery = "";
    
    document.querySelectorAll(".price-btn").forEach(b => b.classList.add("active"));
    document.querySelectorAll(".diet-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".preset-chip").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tag-btn").forEach(b => b.classList.remove("active"));
    document.querySelector('.tag-btn[data-cuisine="all"]').classList.add("active");
    
    syncDOMInputs();
    applyFilters();
  });

  // Price selector buttons
  const priceSelector = document.getElementById("priceSelector");
  priceSelector.addEventListener("click", (e) => {
    if (e.target.classList.contains("price-btn")) {
      const priceVal = parseInt(e.target.getAttribute("data-price"));
      if (state.activePrices.includes(priceVal)) {
        if (state.activePrices.length > 1) {
          state.activePrices = state.activePrices.filter(p => p !== priceVal);
          e.target.classList.remove("active");
        }
      } else {
        state.activePrices.push(priceVal);
        e.target.classList.add("active");
      }
      applyFilters();
    }
  });

  // Dietary Restriction Tags
  const dietaryTags = document.getElementById("dietaryTags");
  dietaryTags.addEventListener("click", (e) => {
    if (e.target.classList.contains("diet-btn")) {
      const diet = e.target.getAttribute("data-diet");
      if (state.activeDiets.includes(diet)) {
        state.activeDiets = state.activeDiets.filter(d => d !== diet);
        e.target.classList.remove("active");
      } else {
        state.activeDiets.push(diet);
        e.target.classList.add("active");
      }
      applyFilters();
    }
  });

  // Cuisine Tags
  const cuisineTags = document.getElementById("cuisineTags");
  cuisineTags.addEventListener("click", (e) => {
    if (e.target.classList.contains("tag-btn") || e.target.closest(".tag-btn")) {
      const btn = e.target.classList.contains("tag-btn") ? e.target : e.target.closest(".tag-btn");
      cuisineTags.querySelectorAll(".tag-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeCuisine = btn.getAttribute("data-cuisine");
      applyFilters();
    }
  });

  // Sort dropdown
  document.getElementById("sortSelect").addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    sortAndRenderFiltered();
  });

  // Viewer Navigation Tabs
  const tabLinks = document.querySelectorAll(".viewer-tabs .tab-link");
  tabLinks.forEach(tab => {
    tab.addEventListener("click", () => {
      switchTab(tab.getAttribute("data-tab"));
    });
  });

  // Shortcut triggers
  document.getElementById("surpriseBtn").addEventListener("click", () => {
    switchTab("wheelView");
    setTimeout(spinWheel, 300);
  });

  document.getElementById("battleQuickBtn").addEventListener("click", () => {
    switchTab("battleView");
    initFoodBattle();
  });

  document.getElementById("favQuickBtn").addEventListener("click", () => {
    switchTab("favView");
  });

  // Decision Wheel Spin Buttons
  document.getElementById("spinWheelBtn").addEventListener("click", spinWheel);
  document.getElementById("randomPickQuickBtn").addEventListener("click", () => {
    if (state.filtered.length === 0) return;
    const random = state.filtered[Math.floor(Math.random() * state.filtered.length)];
    showWinnerDetails(random, "Instant Quick Pick Champion!");
  });

  // Winner Modal Action Buttons
  document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  document.getElementById("winnerModal").addEventListener("click", (e) => {
    if (e.target.id === "winnerModal") closeModal();
  });
  document.getElementById("spinAgainBtn").addEventListener("click", () => {
    closeModal();
    spinWheel();
  });
  document.getElementById("navigateBtn").addEventListener("click", navigateToWinner);

  // Winner Favorite Toggle
  document.getElementById("winnerFavBtn").addEventListener("click", () => {
    if (!state.selectedRestaurant) return;
    toggleFavorite(state.selectedRestaurant.id);
    updateWinnerFavIcon();
  });

  // Add Custom Spot Modal
  document.getElementById("addSpotBtn").addEventListener("click", openAddSpotModal);
  document.getElementById("closeAddSpotModalBtn").addEventListener("click", closeAddSpotModal);
  document.getElementById("cancelAddSpotBtn").addEventListener("click", closeAddSpotModal);
  document.getElementById("addSpotForm").addEventListener("submit", handleAddSpotSubmit);

  // Map Controls
  document.getElementById("mapZoomIn").addEventListener("click", () => {
    state.mapZoomLevel = Math.min(2, state.mapZoomLevel + 0.2);
    updateFallbackSvgZoom();
  });
  document.getElementById("mapZoomOut").addEventListener("click", () => {
    state.mapZoomLevel = Math.max(0.6, state.mapZoomLevel - 0.2);
    updateFallbackSvgZoom();
  });
  document.getElementById("mapRecenter").addEventListener("click", () => {
    state.mapZoomLevel = 1;
    updateFallbackSvgZoom();
  });
  document.getElementById("closeMapPreviewBtn").addEventListener("click", () => {
    document.getElementById("mapPreviewCard").classList.add("hidden");
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".viewer-tabs .tab-link").forEach(t => {
    t.classList.toggle("active", t.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".viewer-panel .tab-content").forEach(content => {
    content.classList.toggle("active", content.id === tabId);
  });

  if (tabId === "wheelView") drawWheel();
  if (tabId === "battleView") initFoodBattle();
  if (tabId === "favView") renderFavoriteCards();
}

// ==========================================================================
// 7. Geolocation Detection & Coordinate Processing
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
        document.getElementById("mapCoordsText").innerText = `GPS: ${state.userLocation.lat.toFixed(4)}°N, ${state.userLocation.lng.toFixed(4)}°E`;
        
        recalculateDistances();
        applyFilters();

        if (state.googleMap) {
          state.googleMap.setCenter(state.userLocation);
          fetchLiveGooglePlaces();
        }
      },
      (error) => {
        badge.classList.remove("active-gps");
        badgeText.innerText = "Downtown Core (Default)";
      }
    );
  } else {
    badgeText.innerText = "Downtown Core (Default)";
  }
}

function recalculateDistances() {
  state.restaurants.forEach(rest => {
    const dLat = rest.lat - state.userLocation.lat;
    const dLng = rest.lng - state.userLocation.lng;
    const distKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111.32;
    rest.distance = parseFloat(distKm.toFixed(1));
  });
}

// ==========================================================================
// 8. Preset Filter Logic
// ==========================================================================
function applyPresetFilter() {
  if (!state.activePreset) {
    applyFilters();
    return;
  }
  
  switch (state.activePreset) {
    case "topRated":
      state.minRating = 4.5;
      break;
    case "budget":
      state.activePrices = [1, 2];
      break;
    case "nearby":
      state.maxRadius = 1.0;
      break;
    case "lateNight":
      state.openNowOnly = true;
      break;
  }
  syncDOMInputs();
  applyFilters();
}

// ==========================================================================
// 9. Core Dynamic Multi-Criteria Filter Engine
// ==========================================================================
function applyFilters() {
  state.filtered = state.restaurants.filter(rest => {
    // Cuisine
    if (state.activeCuisine !== "all" && rest.cuisine !== state.activeCuisine) return false;
    
    // Price
    if (!state.activePrices.includes(rest.price)) return false;
    
    // Rating
    if (rest.rating < state.minRating) return false;
    
    // Radius
    if (rest.distance > state.maxRadius) return false;
    
    // Open Now
    if (state.openNowOnly && !rest.open) return false;
    
    // Dietary restrictions
    if (state.activeDiets.length > 0) {
      const restDiets = rest.dietary || [];
      const matchesAllDiets = state.activeDiets.every(d => restDiets.includes(d));
      if (!matchesAllDiets) return false;
    }
    
    // Search query
    if (state.searchQuery) {
      const q = state.searchQuery;
      const matchName = rest.name.toLowerCase().includes(q);
      const matchCuisine = rest.cuisine.toLowerCase().includes(q);
      const matchDesc = (rest.description || "").toLowerCase().includes(q);
      const matchAddress = (rest.address || "").toLowerCase().includes(q);
      if (!matchName && !matchCuisine && !matchDesc && !matchAddress) return false;
    }
    
    return true;
  });

  sortAndRenderFiltered();
}

function sortAndRenderFiltered() {
  // Apply sorting algorithm
  state.filtered.sort((a, b) => {
    if (state.sortBy === "rating") return b.rating - a.rating;
    if (state.sortBy === "distance") return a.distance - b.distance;
    if (state.sortBy === "priceAsc") return a.price - b.price;
    if (state.sortBy === "priceDesc") return b.price - a.price;
    if (state.sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  // Update Counters
  document.getElementById("matchCount").innerText = state.filtered.length;
  document.getElementById("wheelCountText").innerText = state.filtered.length;
  document.getElementById("wheelPoolSize").innerText = state.filtered.length;

  // Render components
  renderRestaurantCards();
  renderMapMarkers();
  
  if (document.getElementById("wheelView").classList.contains("active")) {
    drawWheel();
  }
}

// ==========================================================================
// 10. List View Cards & Favorites Renderer
// ==========================================================================
function renderRestaurantCards() {
  const container = document.getElementById("restaurantList");
  container.innerHTML = "";

  if (state.filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-list-panel glass-panel">
        <i data-lucide="frown"></i>
        <h3>No restaurants match your filter criteria</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Try widening your distance radius, adjusting minimum rating, or selecting more price tiers.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  state.filtered.forEach(rest => {
    const card = createRestaurantCardDOM(rest);
    container.appendChild(card);
  });

  lucide.createIcons();
}

function renderFavoriteCards() {
  const container = document.getElementById("favRestaurantList");
  container.innerHTML = "";

  const favSpots = state.restaurants.filter(r => state.favorites.includes(r.id));

  if (favSpots.length === 0) {
    container.innerHTML = `
      <div class="empty-list-panel glass-panel">
        <i data-lucide="heart-off"></i>
        <h3>No saved favorite restaurants yet</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Click the heart icon on any restaurant card to bookmark your top dining choices here!</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  favSpots.forEach(rest => {
    const card = createRestaurantCardDOM(rest);
    container.appendChild(card);
  });

  lucide.createIcons();
}

function createRestaurantCardDOM(rest) {
  const card = document.createElement("div");
  card.className = "restaurant-card glass-panel";
  card.addEventListener("click", () => showWinnerDetails(rest, "Restaurant Details"));

  const isFav = state.favorites.includes(rest.id);
  const priceString = "$".repeat(rest.price);
  const statusText = rest.open ? "Open Now" : "Closed";
  const statusClass = rest.open ? "open" : "closed";

  // Dietary mini pills HTML
  let dietPillsHTML = "";
  if (rest.dietary && rest.dietary.length > 0) {
    dietPillsHTML = `<div class="card-diet-pills">` + 
      rest.dietary.map(d => `<span class="diet-mini-pill">${formatDietName(d)}</span>`).join("") + 
      `</div>`;
  }

  card.innerHTML = `
    <div class="card-top">
      <span class="cuisine-badge">${rest.cuisine}</span>
      <div class="card-top-right">
        <button class="fav-heart-btn ${isFav ? 'is-fav' : ''}" data-id="${rest.id}" title="Toggle Favorite">
          <i data-lucide="heart"></i>
        </button>
        <span class="rating-badge"><i data-lucide="star"></i> ${rest.rating.toFixed(1)}</span>
      </div>
    </div>
    <div class="card-body">
      <div>
        <h4>${rest.name}</h4>
        <p class="desc">${rest.description}</p>
        ${dietPillsHTML}
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

  // Attach favorite click event without opening detail modal
  const favBtn = card.querySelector(".fav-heart-btn");
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(rest.id);
    favBtn.classList.toggle("is-fav", state.favorites.includes(rest.id));
  });

  return card;
}

function formatDietName(dietKey) {
  const map = {
    vegan: "🌿 Vegan",
    vegetarian: "🥗 Veg",
    halal: "🌙 Halal",
    glutenFree: "🌾 GF"
  };
  return map[dietKey] || dietKey;
}

function toggleFavorite(id) {
  if (state.favorites.includes(id)) {
    state.favorites = state.favorites.filter(favId => favId !== id);
  } else {
    state.favorites.push(id);
    playAudioTick();
  }
  saveFavorites();
  if (document.getElementById("favView").classList.contains("active")) {
    renderFavoriteCards();
  }
}

// ==========================================================================
// 11. Google Maps & Interactive Vector Radar Map Engine
// ==========================================================================
window.gm_authFailure = function() {
  console.warn("Google Maps API Authentication Failure. Falling back to Vector Radar Map.");
  initFallbackMap();
  const hudBadge = document.querySelector(".hud-badge-status span:last-child");
  if (hudBadge) {
    hudBadge.innerText = "Vector Radar Map (Google Maps API Auth Issue)";
  }
};

function loadGoogleMapsScript() {
  const hasKey = typeof CONFIG !== "undefined" && CONFIG.GOOGLE_MAPS_API_KEY && CONFIG.GOOGLE_MAPS_API_KEY.trim() !== "";
  
  if (hasKey) {
    if (document.getElementById("googleMapsScript")) return;

    const script = document.createElement("script");
    script.id = "googleMapsScript";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(CONFIG.GOOGLE_MAPS_API_KEY.trim())}&libraries=places&callback=initGoogleMap&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = (e) => {
      console.warn("Failed to load Google Maps script from CDN.", e);
      initFallbackMap();
    };
    document.head.appendChild(script);
  } else {
    initFallbackMap();
  }
}

window.initGoogleMap = function() {
  console.log("Google Maps API loaded successfully.");
  const fallback = document.getElementById("fallbackMap");
  const mapElement = document.getElementById("googleMap");
  
  if (fallback) fallback.style.display = "none";
  if (mapElement) {
    mapElement.style.display = "block";
    mapElement.style.zIndex = "5";
  }

  try {
    state.googleMap = new google.maps.Map(mapElement, {
      center: state.userLocation,
      zoom: 15,
      styles: GOOGLE_MAP_DARK_STYLES,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false
    });

    state.userMarker = new google.maps.Marker({
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

    const searchInput = document.getElementById("searchInput");
    if (searchInput && google.maps.places) {
      state.googleAutocomplete = new google.maps.places.Autocomplete(searchInput);
      state.googleAutocomplete.bindTo("bounds", state.googleMap);
      
      state.googleAutocomplete.addListener("place_changed", () => {
        const place = state.googleAutocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        
        state.userLocation.lat = place.geometry.location.lat();
        state.userLocation.lng = place.geometry.location.lng();
        state.googleMap.setCenter(state.userLocation);
        state.googleMap.setZoom(15);
        
        recalculateDistances();
        fetchLiveGooglePlaces();
      });
    }

    renderMapMarkers();
    fetchLiveGooglePlaces();
  } catch (err) {
    console.error("Error initializing Google Maps:", err);
    initFallbackMap();
  }
};

function fetchLiveGooglePlaces() {
  if (!state.googleMap || typeof google === "undefined" || !google.maps.places) return;

  const service = new google.maps.places.PlacesService(state.googleMap);
  const request = {
    location: state.userLocation,
    radius: Math.min(state.maxRadius * 1000, 5000),
    type: ["restaurant", "food", "cafe"]
  };

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
      const liveRestaurants = results.map((place, idx) => {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        const dLat = lat - state.userLocation.lat;
        const dLng = lng - state.userLocation.lng;
        const distKm = parseFloat((Math.sqrt(dLat * dLat + dLng * dLng) * 111.32).toFixed(1));

        return {
          id: `g_${place.place_id || idx}`,
          name: place.name,
          cuisine: inferCuisineFromTypes(place.types),
          price: place.price_level || Math.floor(Math.random() * 3) + 1,
          rating: place.rating || 4.2,
          distance: distKm,
          open: place.opening_hours ? place.opening_hours.open_now : true,
          lat: lat,
          lng: lng,
          address: place.vicinity || "Local Area",
          phone: "+65 Live Google Data",
          description: `Live Google Place • ${place.user_ratings_total || 0} reviews on Google Maps.`,
          dietary: inferDietaryFromTypes(place.types)
        };
      });

      state.restaurants = [...liveRestaurants];
      applyFilters();
    }
  });
}

function inferCuisineFromTypes(types = []) {
  if (!types) return "Asian";
  const t = types.join(" ").toLowerCase();
  if (t.includes("japanese") || t.includes("sushi") || t.includes("ramen")) return "Japanese";
  if (t.includes("italian") || t.includes("pizza") || t.includes("pasta")) return "Italian";
  if (t.includes("american") || t.includes("burger")) return "American";
  if (t.includes("thai")) return "Thai";
  if (t.includes("mexican") || t.includes("taco")) return "Mexican";
  if (t.includes("cafe") || t.includes("bakery") || t.includes("coffee")) return "Cafe";
  if (t.includes("indian")) return "Indian";
  if (t.includes("chinese")) return "Chinese";
  return "Asian";
}

function inferDietaryFromTypes(types = []) {
  if (!types) return [];
  const diets = [];
  const t = types.join(" ").toLowerCase();
  if (t.includes("vegan")) diets.push("vegan");
  if (t.includes("vegetarian")) diets.push("vegetarian");
  if (t.includes("halal")) diets.push("halal");
  return diets;
}

function renderMapMarkers() {
  if (state.googleMap) {
    state.googleMarkers.forEach(m => m.setMap(null));
    state.googleMarkers = [];

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
          <a href="#" onclick="window.showDetailsFromMap(${rest.id}); return false;" style="color:#f43f5e; font-weight:700;">View Details</a>
        </div>`
      });

      marker.addListener("click", () => infoWindow.open(state.googleMap, marker));
      state.googleMarkers.push(marker);
    });
  } else {
    updateFallbackSvgMarkers();
  }
}

window.showDetailsFromMap = function(id) {
  const restaurant = state.restaurants.find(r => r.id === id);
  if (restaurant) showWinnerDetails(restaurant, "Venue Details");
};

// Fallback Interactive Vector Radar Map
function initFallbackMap() {
  document.getElementById("googleMap").style.display = "none";
  document.getElementById("fallbackMap").style.display = "flex";

  const svg = document.getElementById("svgMap");
  svg.innerHTML = `
    <rect width="1000" height="650" fill="#0f131a" />
    <path class="svg-park" d="M 0,0 L 320,0 L 220,160 L 60,240 Z" />
    <path class="svg-park" d="M 750,450 L 1000,400 L 1000,650 L 700,650 Z" />
    <path class="svg-river" d="M -50,520 Q 250,460 500,280 T 1050,80" />
    
    <!-- Building block accents -->
    <rect class="svg-building" x="120" y="80" width="70" height="50" />
    <rect class="svg-building" x="420" y="140" width="90" height="60" />
    <rect class="svg-building" x="650" y="240" width="80" height="80" />
    <rect class="svg-building" x="220" y="380" width="100" height="70" />

    <!-- Road Grid system -->
    <path class="svg-road-main" d="M 500,-20 L 500,670" />
    <path class="svg-road-main" d="M -20,325 L 1020,325" />
    <path class="svg-road" d="M 180,-20 L 180,670" />
    <path class="svg-road" d="M 340,-20 L 340,670" />
    <path class="svg-road" d="M 680,-20 L 680,670" />
    <path class="svg-road" d="M 840,-20 L 840,670" />
    <path class="svg-road" d="M -20,150 L 1020,150" />
    <path class="svg-road" d="M -20,480 L 1020,480" />
  `;

  // Center user node
  const userX = 500;
  const userY = 325;

  svg.innerHTML += `
    <circle class="user-pulse" cx="${userX}" cy="${userY}" r="40" />
    <circle class="user-pulse" cx="${userX}" cy="${userY}" r="20" />
    <circle class="user-node" cx="${userX}" cy="${userY}" r="9" />
  `;

  const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  markerGroup.id = "svgMarkerGroup";
  svg.appendChild(markerGroup);

  updateFallbackSvgMarkers();
}

function updateFallbackSvgMarkers() {
  const markerGroup = document.getElementById("svgMarkerGroup");
  if (!markerGroup) return;
  
  markerGroup.innerHTML = "";

  state.filtered.forEach(rest => {
    const x = ((rest.lng - SVG_MAP_BOUNDS.minLng) / (SVG_MAP_BOUNDS.maxLng - SVG_MAP_BOUNDS.minLng)) * 1000;
    const y = 650 - (((rest.lat - SVG_MAP_BOUNDS.minLat) / (SVG_MAP_BOUNDS.maxLat - SVG_MAP_BOUNDS.minLat)) * 650);

    const pin = document.createElementNS("http://www.w3.org/2000/svg", "g");
    pin.setAttribute("class", "svg-pin");
    pin.setAttribute("transform", `translate(${x}, ${y})`);
    
    pin.addEventListener("click", (e) => {
      e.stopPropagation();
      showMapPreviewCard(rest);
    });

    pin.innerHTML = `
      <circle class="svg-pin-pulse" cx="0" cy="0" r="14" />
      <path d="M 0,0 C -6,-10 -12,-18 -12,-25 C -12,-33 -6,-38 0,-38 C 6,-38 12,-33 12,-25 C 12,-18 6,-10 0,0 Z" />
      <circle cx="0" cy="-25" r="4.5" fill="#ffffff" />
    `;

    markerGroup.appendChild(pin);
  });
}

function updateFallbackSvgZoom() {
  const svg = document.getElementById("svgMap");
  if (svg) {
    const scale = state.mapZoomLevel;
    svg.style.transform = `scale(${scale})`;
    svg.style.transformOrigin = "50% 50%";
    svg.style.transition = "transform 0.3s ease";
  }
}

function showMapPreviewCard(rest) {
  document.getElementById("prevCuisine").innerText = rest.cuisine;
  document.getElementById("prevRating").innerText = `★ ${rest.rating.toFixed(1)}`;
  document.getElementById("prevName").innerText = rest.name;
  document.getElementById("prevAddress").innerText = rest.address;
  document.getElementById("prevDistance").innerText = `${rest.distance} km`;
  document.getElementById("prevPrice").innerText = "$".repeat(rest.price);
  
  const card = document.getElementById("mapPreviewCard");
  card.classList.remove("hidden");
  
  const detailsBtn = document.getElementById("prevDetailsBtn");
  detailsBtn.onclick = () => showWinnerDetails(rest, "Selected Map Pin");
}

// ==========================================================================
// 12. MODE 1: Wheel of Food Roulette Engine (Canvas)
// ==========================================================================
let wheelState = {
  angle: 0,
  speed: 0,
  deceleration: 0.985,
  sliceAngle: 0,
  lastTickSlice: -1
};

function drawWheel() {
  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  const count = state.filtered.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (count === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.arc(250, 250, 220, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "var(--text-muted)";
    ctx.font = "bold 18px Outfit";
    ctx.textAlign = "center";
    ctx.fillText("No matching restaurants in pool", 250, 240);
    ctx.font = "14px Plus Jakarta Sans";
    ctx.fillText("Adjust filters to spin wheel", 250, 265);
    return;
  }

  const radius = 220;
  const centerX = 250;
  const centerY = 250;
  const sliceAngle = (2 * Math.PI) / count;
  wheelState.sliceAngle = sliceAngle;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(wheelState.angle);

  for (let i = 0; i < count; i++) {
    const item = state.filtered[i];
    const currentAngle = i * sliceAngle;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();

    const hue = (hashString(item.cuisine) + (i * 35)) % 360;
    ctx.fillStyle = `hsl(${hue}, 70%, 30%)`;
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label Text
    ctx.save();
    ctx.rotate(currentAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Outfit";
    
    let label = item.name;
    if (label.length > 19) label = label.slice(0, 17) + "...";
    ctx.fillText(label, radius - 18, 5);
    ctx.restore();
  }

  // Ring border
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.stroke();

  ctx.restore();

  // Core center cap
  ctx.beginPath();
  ctx.arc(centerX, centerY, 48, 0, 2 * Math.PI);
  ctx.fillStyle = "#0f131a";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash % 360);
}

function spinWheel() {
  if (state.filtered.length === 0 || state.isSpinning) return;
  
  state.isSpinning = true;
  document.getElementById("spinWheelBtn").disabled = true;

  wheelState.speed = 0.35 + Math.random() * 0.35;
  wheelState.deceleration = 0.983 + Math.random() * 0.004;

  animateWheelSpin();
}

function animateWheelSpin() {
  if (wheelState.speed > 0.001) {
    wheelState.angle += wheelState.speed;
    wheelState.speed *= wheelState.deceleration;
    
    // Calculate audio click ticks
    const currentSlice = Math.floor((wheelState.angle % (2 * Math.PI)) / wheelState.sliceAngle);
    if (currentSlice !== wheelState.lastTickSlice) {
      playAudioTick();
      wheelState.lastTickSlice = currentSlice;
    }

    drawWheel();
    requestAnimationFrame(animateWheelSpin);
  } else {
    state.isSpinning = false;
    document.getElementById("spinWheelBtn").disabled = false;

    const totalRotation = wheelState.angle % (2 * Math.PI);
    const pointerOffset = (3 / 2) * Math.PI;
    let relativeAngle = pointerOffset - totalRotation;
    while (relativeAngle < 0) relativeAngle += 2 * Math.PI;
    
    const landingIndex = Math.floor(relativeAngle / wheelState.sliceAngle) % state.filtered.length;
    const winner = state.filtered[landingIndex];
    
    playVictoryChime();
    launchConfettiBurst();
    showWinnerDetails(winner, "Wheel of Food Winner!");
  }
}

// ==========================================================================
// 14. MODE 3: Food Battle Tournament Engine (Face-Off)
// ==========================================================================
function initFoodBattle() {
  const arena = document.getElementById("battleArena");
  
  if (state.filtered.length < 2) {
    arena.innerHTML = `
      <div class="empty-list-panel glass-panel">
        <i data-lucide="alert-triangle"></i>
        <h3>Need at least 2 restaurants for Food Battle</h3>
        <p style="font-size:0.85rem; color:var(--text-muted);">Adjust your filter criteria to include more restaurants.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Shuffle candidate pool
  state.battleCandidates = [...state.filtered].sort(() => Math.random() - 0.5);
  state.battleRound = 1;
  renderBattleRound();
}

function renderBattleRound() {
  const arena = document.getElementById("battleArena");
  
  if (state.battleCandidates.length === 1) {
    // We have a winner!
    const winner = state.battleCandidates[0];
    playVictoryChime();
    launchConfettiBurst();
    showWinnerDetails(winner, "Tournament Champion!");
    return;
  }

  const optionA = state.battleCandidates[0];
  const optionB = state.battleCandidates[1];

  arena.innerHTML = `
    <div class="battle-card glass-panel" id="cardA">
      <span class="cuisine-badge">${optionA.cuisine}</span>
      <h3>${optionA.name}</h3>
      <p style="font-size:0.85rem; color:var(--text-muted);">${optionA.description}</p>
      <div style="font-weight:700; color:var(--accent-amber);">★ ${optionA.rating.toFixed(1)} • ${optionA.distance} km • ${"$".repeat(optionA.price)}</div>
      <button class="primary-btn glow-btn vote-btn" onclick="voteBattleCandidate(0)">Vote Option A</button>
    </div>
    
    <div class="battle-vs-badge">VS</div>
    
    <div class="battle-card glass-panel" id="cardB">
      <span class="cuisine-badge">${optionB.cuisine}</span>
      <h3>${optionB.name}</h3>
      <p style="font-size:0.85rem; color:var(--text-muted);">${optionB.description}</p>
      <div style="font-weight:700; color:var(--accent-amber);">★ ${optionB.rating.toFixed(1)} • ${optionB.distance} km • ${"$".repeat(optionB.price)}</div>
      <button class="primary-btn glow-btn vote-btn" onclick="voteBattleCandidate(1)">Vote Option B</button>
    </div>
  `;
}

window.voteBattleCandidate = function(winnerIdx) {
  playAudioTick();
  // Eliminate loser (the other index)
  const loserIdx = winnerIdx === 0 ? 1 : 0;
  state.battleCandidates.splice(loserIdx, 1);
  state.battleRound++;
  renderBattleRound();
};

// ==========================================================================
// 15. Winner / Detail Modal & Custom Spot Modal Management
// ==========================================================================
function showWinnerDetails(restaurant, subtitle = "Today's Selected Venue!") {
  state.selectedRestaurant = restaurant;
  
  document.getElementById("winnerSubtitle").innerText = subtitle;
  document.getElementById("winnerCuisine").innerText = restaurant.cuisine;
  document.getElementById("winnerName").innerText = restaurant.name;
  document.getElementById("winnerRating").innerText = restaurant.rating.toFixed(1);
  document.getElementById("winnerPrice").innerText = "$".repeat(restaurant.price);
  document.getElementById("winnerDistance").innerText = `${restaurant.distance} km away`;
  document.getElementById("winnerDescription").innerText = restaurant.description;
  document.getElementById("winnerHours").innerText = restaurant.open ? "Open Now (Closes 10:00 PM)" : "Closed (Opens Tomorrow)";
  document.getElementById("winnerAddress").innerText = restaurant.address || "Local Dining Area";
  document.getElementById("winnerPhone").innerText = restaurant.phone || "+65 6000 0000";

  // Modal diet tags
  const dietContainer = document.getElementById("winnerDietTags");
  if (restaurant.dietary && restaurant.dietary.length > 0) {
    dietContainer.innerHTML = restaurant.dietary.map(d => `<span class="diet-mini-pill">${formatDietName(d)}</span>`).join("");
  } else {
    dietContainer.innerHTML = "";
  }

  updateWinnerFavIcon();

  const modal = document.getElementById("winnerModal");
  modal.classList.add("active");
}

function updateWinnerFavIcon() {
  if (!state.selectedRestaurant) return;
  const isFav = state.favorites.includes(state.selectedRestaurant.id);
  const favBtn = document.getElementById("winnerFavBtn");
  favBtn.classList.toggle("is-fav", isFav);
}

function closeModal() {
  document.getElementById("winnerModal").classList.remove("active");
  state.selectedRestaurant = null;
}

function navigateToWinner() {
  if (!state.selectedRestaurant) return;
  const query = encodeURIComponent(`${state.selectedRestaurant.name} ${state.selectedRestaurant.address}`);
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
}

// Add Custom Spot Modal Functions
function openAddSpotModal() {
  document.getElementById("addSpotModal").classList.add("active");
}

function closeAddSpotModal() {
  document.getElementById("addSpotModal").classList.remove("active");
  document.getElementById("addSpotForm").reset();
}

function handleAddSpotSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById("newSpotName").value.trim();
  const cuisine = document.getElementById("newSpotCuisine").value;
  const price = parseInt(document.getElementById("newSpotPrice").value);
  const rating = parseFloat(document.getElementById("newSpotRating").value);
  const distance = parseFloat(document.getElementById("newSpotDistance").value);
  const address = document.getElementById("newSpotAddress").value.trim() || "Local Address";
  const description = document.getElementById("newSpotDesc").value.trim() || "Custom added favorite restaurant.";

  const newSpot = {
    id: Date.now(),
    name,
    cuisine,
    price,
    rating,
    distance,
    open: true,
    lat: state.userLocation.lat + (Math.random() - 0.5) * 0.02,
    lng: state.userLocation.lng + (Math.random() - 0.5) * 0.02,
    address,
    phone: "+65 6888 9999",
    description,
    dietary: ["vegetarian"]
  };

  state.restaurants.unshift(newSpot);
  saveCustomSpots(newSpot);
  
  closeAddSpotModal();
  applyFilters();
  playVictoryChime();
  showWinnerDetails(newSpot, "Custom Restaurant Added!");
}

