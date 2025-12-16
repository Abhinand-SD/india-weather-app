import { useState } from 'react';

export default function SearchBox({ onSearch }) {
    const [city, setCity] = useState('');

    const handleSubmit = () => {
        if (city.trim()) {
            onSearch(city.trim());
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="search-box">
            <input
                type="text"
                id="city-input"
                placeholder="Enter city name..."
                autoComplete="off"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button id="search-btn" aria-label="Search" onClick={handleSubmit}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
        </div>
    );
}
