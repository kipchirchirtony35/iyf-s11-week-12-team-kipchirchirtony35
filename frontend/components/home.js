// ===== AUTH CHECK =====
// If nobody is logged in, send them back to the login page.
const loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
  window.location.href = "../../Login.html";
}

// ===== GREET THE USER =====
document.getElementById("welcomeUser").textContent = `Welcome, ${loggedInUser}`;

// ===== LOGOUT =====
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../../Login.html";
});

// ===== SIDEBAR TOGGLE (same behavior as the main library page) =====
const sidebar = document.getElementById("sidebar");
const mainContent = document.querySelector(".main-content");

function toggleSidebar() {
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle("open");
  } else {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("full-width");
  }
}

function selectLink(link) {
  document.querySelectorAll(".sidebar a").forEach((a) => a.classList.remove("active"));
  link.classList.add("active");

  if (window.innerWidth <= 768) {
    sidebar.classList.remove("open");
  }
  // For now this page just shows the dashboard; wire this up to
  // filter academicGrid or redirect to index.html#category later.
}

// ===== WEATHER (Open-Meteo — free, no API key required) =====
const weatherCard = document.getElementById("weatherCard");

// Default to Nairobi if geolocation isn't available/allowed
const DEFAULT_LOCATION = { lat: -1.2921, lon: 36.8219, name: "Nairobi" };

const weatherCodeMap = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  61: { label: "Light rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  80: { label: "Rain showers", icon: "🌦️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
};

async function loadWeather(lat, lon, locationName) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const res = await fetch(url);
    const data = await res.json();

    const current = data.current;
    const weatherInfo = weatherCodeMap[current.weather_code] || { label: "Unknown", icon: "🌡️" };

    weatherCard.innerHTML = `
      <div class="weather-main">
        <div class="weather-icon">${weatherInfo.icon}</div>
        <div>
          <div class="weather-location">${locationName}</div>
          <div class="weather-temp">${Math.round(current.temperature_2m)}°C</div>
        </div>
      </div>
      <div class="weather-details">
        <p>${weatherInfo.label}</p>
        <p>Humidity: ${current.relative_humidity_2m}%</p>
        <p>Wind: ${Math.round(current.wind_speed_10m)} km/h</p>
      </div>
    `;
  } catch (err) {
    weatherCard.innerHTML = `<p>Couldn't load weather right now.</p>`;
    console.error("Weather fetch failed:", err);
  }
}

// Try browser geolocation first, fall back to Nairobi default
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      loadWeather(position.coords.latitude, position.coords.longitude, "Your location");
    },
    () => {
      loadWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name);
    }
  );
} else {
  loadWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name);
}

// ===== ACADEMIC BOOKS =====
const academicBooks = [
  { title: "Principles of Economics", author: "N. Gregory Mankiw", cover: "https://covers.openlibrary.org/b/id/8406878-L.jpg" },
  { title: "Financial Accounting", author: "Jerry J. Weygandt", cover: "https://covers.openlibrary.org/b/id/8235115-L.jpg" },
  { title: "Money, Banking, and Financial Markets", author: "Stephen Cecchetti", cover: "https://covers.openlibrary.org/b/id/8091016-L.jpg" },
  { title: "International Economics", author: "Paul Krugman", cover: "https://covers.openlibrary.org/b/id/8406795-L.jpg" },
];

const academicGrid = document.getElementById("academicGrid");

academicBooks.forEach((book) => {
  const card = document.createElement("div");
  card.className = "book-card";
  card.innerHTML = `
    <img src="${book.cover}" alt="${book.title} cover" onerror="this.src='https://via.placeholder.com/160x220?text=No+Cover'">
    <div class="book-info">
      <div class="book-title">${book.title}</div>
      <div class="book-author">${book.author}</div>
    </div>
  `;
  academicGrid.appendChild(card);
});

// ===== POSTS / FEED =====
const posts = [
  { author: "Library Team", time: "2h ago", body: "New academic titles just added to the Technology and Economics shelves — check them out!" },
  { author: "Jane M.", time: "5h ago", body: "Just finished 'Sapiens' — highly recommend it if you're into history and anthropology." },
  { author: "Library Team", time: "1d ago", body: "Reminder: borrowed books are due back within 14 days. Renew from your account page." },
];

const postsList = document.getElementById("postsList");

posts.forEach((post) => {
  const card = document.createElement("div");
  card.className = "post-card";
  const initials = post.author.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  card.innerHTML = `
    <div class="post-header">
      <div class="post-avatar">${initials}</div>
      <div class="post-author">${post.author}</div>
      <div class="post-time">${post.time}</div>
    </div>
    <div class="post-body">${post.body}</div>
  `;
  postsList.appendChild(card);
});