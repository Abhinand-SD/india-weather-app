import { useState } from 'react';
import SearchBox from './components/SearchBox';
import WeatherInfo from './components/WeatherInfo';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (city) => {
    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const locationData = await getCoordinates(city);
      if (!locationData) {
        throw new Error('City not found. Please check spelling.');
      }

      const weather = await getWeather(locationData.latitude, locationData.longitude);
      setWeatherData({
        location: locationData,
        current: weather.current
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  async function getCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding API error');
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }
    return data.results[0];
  }

  async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API error');
    return await response.json();
  }

  return (
    <div className="container">
      <header>
        <h1>Weather App</h1>
      </header>

      <SearchBox onSearch={handleSearch} />

      {error && <ErrorMessage message={error} />}
      {loading && <Loader />}
      {weatherData && !loading && <WeatherInfo data={weatherData} />}
    </div>
  );
}

export default App;
