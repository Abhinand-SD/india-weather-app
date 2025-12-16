import React from 'react';

export default function WeatherInfo({ data }) {
    if (!data) return null;
    const { location, current } = data;

    const weatherCondition = getWeatherCondition(current.weather_code);
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="weather-info">
            <h2 id="city-name">{location.name}{location.country ? `, ${location.country}` : ''}</h2>
            <p id="date">{dateStr}</p>

            <div className="weather-main">
                <div className="temp-container">
                    <span id="temperature">{Math.round(current.temperature_2m)}</span><span className="unit">°C</span>
                </div>
                <div className="condition-container">
                    <p id="condition">{weatherCondition}</p>
                </div>
            </div>

            <div className="details">
                <div className="detail-card">
                    <span className="label">Humidity</span>
                    <span className="value" id="humidity">{current.relative_humidity_2m}%</span>
                </div>
                <div className="detail-card">
                    <span className="label">Wind Speed</span>
                    <span className="value" id="wind-speed">{current.wind_speed_10m} km/h</span>
                </div>
            </div>
        </div>
    );
}

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
