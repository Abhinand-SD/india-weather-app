const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const errorMsg = document.getElementById('error-msg');
const loader = document.getElementById('loader');

// Elements to update
const cityNameEl = document.getElementById('city-name');
const dateEl = document.getElementById('date');
const tempEl = document.getElementById('temperature');
const conditionEl = document.getElementById('condition');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) return;

    showLoader();
    hideError();
    hideWeather();

    try {
        const locationData = await getCoordinates(city);
        if (!locationData) {
            throw new Error('City not found. Please check spelling.');
        }

        const weatherData = await getWeather(locationData.latitude, locationData.longitude);
        updateUI(locationData, weatherData);

    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
    }
}

async function getCoordinates(city) {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Geocoding API error');
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return null;
        }
        return data.results[0];
    } catch (err) {
        console.error(err);
        throw new Error('Failed to fetch location data.');
    }
}

async function getWeather(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather API error');
        return await response.json();
    } catch (err) {
        console.error(err);
        throw new Error('Failed to fetch weather data.');
    }
}

function updateUI(locationData, weatherData) {
    const current = weatherData.current;

    // Update Text Content
    cityNameEl.textContent = `${locationData.name}${locationData.country ? ', ' + locationData.country : ''}`;

    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    tempEl.textContent = Math.round(current.temperature_2m);
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;

    const code = current.weather_code;
    conditionEl.textContent = getWeatherCondition(code);

    showWeather();
}

// WMO Weather interpretation codes (WW)
function getWeatherCondition(code) {
    const codes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return codes[code] || 'Unknown';
}

function showLoader() {
    loader.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showWeather() {
    weatherInfo.classList.remove('hidden');
}

function hideWeather() {
    weatherInfo.classList.add('hidden');
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
}

function hideError() {
    errorMsg.classList.add('hidden');
}
