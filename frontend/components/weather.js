const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };

  const cityInput = document.getElementById('cityInput');
  const searchBtn = document.getElementById('searchBtn');
  const weatherCard = document.getElementById('weatherCard');
  const loading = document.getElementById('loading');
  const errorEl = document.getElementById('error');

  searchBtn.addEventListener('click', searchWeather);
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
  });

  async function searchWeather() {
    const query = cityInput.value.trim();
    if (!query) return;

    weatherCard.classList.remove('visible');
    errorEl.style.display = 'none';
    loading.style.display = 'block';
    searchBtn.disabled = true;

    try {
      // 1. Geocode the location
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Location not found. Try a different city name.');
      }

      const place = geoData.results[0];
      const { latitude, longitude, name, country, admin1 } = place;

      // 2. Fetch weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto&forecast_days=6`
      );
      const weatherData = await weatherRes.json();

      // Display data
      document.getElementById('location').textContent = name;
      document.getElementById('country').textContent = 
        [admin1, country].filter(Boolean).join(', ');

      const current = weatherData.current;
      document.getElementById('temp').textContent = `${Math.round(current.temperature_2m)}°C`;
      document.getElementById('condition').textContent = 
        weatherCodes[current.weather_code] || 'Unknown';
      document.getElementById('feelsLike').textContent = 
        `${Math.round(current.apparent_temperature)}°C`;
      document.getElementById('humidity').textContent = 
        `${current.relative_humidity_2m}%`;
      document.getElementById('wind').textContent = 
        `${Math.round(current.wind_speed_10m)} km/h`;
      document.getElementById('precip').textContent = 
        `${current.precipitation} mm`;

      // Forecast (skip today, show next 5 days)
      const forecastEl = document.getElementById('forecast');
      forecastEl.innerHTML = '';
      const days = weatherData.daily.time;
      const maxTemps = weatherData.daily.temperature_2m_max;
      const minTemps = weatherData.daily.temperature_2m_min;

      for (let i = 1; i <= 5; i++) {
        const date = new Date(days[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerHTML = `
          <div class="day-name">${dayName}</div>
          <div class="day-temp">${Math.round(maxTemps[i])}° / ${Math.round(minTemps[i])}°</div>
        `;
        forecastEl.appendChild(dayDiv);
      }

      weatherCard.classList.add('visible');
    } catch (err) {
      errorEl.textContent = err.message || 'Something went wrong. Please try again.';
      errorEl.style.display = 'block';
    } finally {
      loading.style.display = 'none';
      searchBtn.disabled = false;
    }
  }