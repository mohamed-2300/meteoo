import { Oval } from 'react-loader-spinner';
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Grp204WeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: null,
    error: false,
  });
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState([]); // State to store favorite cities
  const api_key = 'f00c38e0279b7bc85480c3fe775d518c'; // Use your API key

  const toDateFunction = () => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août',
      'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ];
    const weekDays = [
      'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi',
    ];
    const currentDate = new Date();
    return `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setWeather({ ...weather, loading: true, error: false });
      setInput('');

      try {
        const currentWeatherResponse = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              q: input,
              units: 'metric',
              appid: api_key,
            },
          }
        );

        const forecastResponse = await axios.get(
          'https://api.openweathermap.org/data/2.5/forecast',
          {
            params: {
              q: input,
              units: 'metric',
              appid: api_key,
            },
          }
        );

        setWeather({ data: currentWeatherResponse.data, loading: false, error: false });

        // Extract forecast data for 5 days at 12:00 PM
        const dailyForecast = forecastResponse.data.list
          .filter((reading) => reading.dt_txt.includes('12:00:00'))
          .slice(0, 5);

        setForecast(dailyForecast);
      } catch (error) {
        setWeather({ data: null, loading: false, error: true });
      }
    }
  };

  const addToFavorites = () => {
    if (input && !favorites.includes(input)) {
      setFavorites([...favorites, input]); // Add the city to the favorites list
      console.log(`City ${input} added to favorites.`);
    } else {
      console.log('City is either empty or already in the favorites.');
    }
  };

  return (
    <div className="App">
      <h1 className="app-name">Application Météo grp204</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
        <button onClick={addToFavorites}>Ajouter aux favoris</button>
      </div>
      {weather.loading && <Oval type="Oval" color="black" height={100} width={100} />}
      {weather.error && (
        <span className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable</span>
        </span>
      )}
      {weather.data && (
        <div>
          <h2>
            {weather.data.name}, {weather.data.sys.country}
          </h2>
          <span>{toDateFunction()}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description}
          />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
        </div>
      )}

      {/* Display Favorite Cities */}
      {favorites.length > 0 && (
        <div className="favorites">
          <h3>Villes favorites</h3>
          <ul>
            {favorites.map((city, index) => (
              <li key={index}>{city}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Forecast for the next 5 days */}
      {forecast.length > 0 && (
        <div className="forecast-container">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-day">
              <h3>
                {new Date(day.dt_txt).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                })}
              </h3>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
              />
              <p>{Math.round(day.main.temp)}°C</p>
              <p>{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Grp204WeatherApp;
