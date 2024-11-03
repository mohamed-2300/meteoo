import { Oval } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Grp204WeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const toDateFunction = () => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const currentDate = new Date();
    const date = `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ ...weather, loading: true });
      const url = 'https://api.openweathermap.org/data/2.5/forecast';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';  // Use your API key here

      await axios
        .get(url, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        })
        .then((res) => {
          setWeather({ data: res.data, loading: false, error: false });
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          setInput('');
        });
    }
  };

  const addToFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!storedFavorites.includes(input)) {
      storedFavorites.push(input);
      localStorage.setItem('favorites', JSON.stringify(storedFavorites));
      setFavorites(storedFavorites);
    }
  };

  const handleFavoriteClick = (city) => {
    setInput(city);
    search({ key: 'Enter' });
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
      
      {weather.loading && (
        <>
          <Oval type="Oval" color="black" height={100} width={100} />
        </>
      )}

      {weather.error && (
        <>
          <span className="error-message">
            <FontAwesomeIcon icon={faFrown} />
            <span>Ville introuvable</span>
          </span>
        </>
      )}

      {weather.data.city && (
        <div>
          <h2>{weather.data.city.name}, {weather.data.city.country}</h2>
          <span>{toDateFunction()}</span>
          
          {weather.data.list && weather.data.list.slice(0, 5).map((forecast, index) => (
            <div key={index} className="forecast">
              <h3>{new Date(forecast.dt_txt).toLocaleDateString()}</h3>
              <img
                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                alt={forecast.weather[0].description}
              />
              <p>{Math.round(forecast.main.temp)}°C</p>
              <p>{forecast.weather[0].description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="favorites">
        <h3>Villes favorites</h3>
        {favorites.map((city, index) => (
          <button key={index} onClick={() => handleFavoriteClick(city)}>
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Grp204WeatherApp;
