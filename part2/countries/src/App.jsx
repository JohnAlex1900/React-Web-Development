import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the countries data:", error);
      });
  }, []);

  useEffect(() => {
    const result = countries.filter((country) =>
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredCountries(result);
  }, [filter, countries]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setSelectedCountry(null);
    setWeather(null); // Reset weather data when filter changes
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
    fetchWeather(country);
  };

  const fetchWeather = (country) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const capital = country.capital[0];
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`;

    axios
      .get(url)
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the weather data:", error);
      });
  };

  return (
    <div>
      <h2>Country Search</h2>
      <div>
        <input
          value={filter}
          onChange={handleFilterChange}
          placeholder="Search for a country"
        />
      </div>
      <div>
        {filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filteredCountries.length === 1 || selectedCountry ? (
          <>
            <CountryDetails country={selectedCountry || filteredCountries[0]} />
            {weather && (
              <WeatherDetails
                weather={weather}
                country={selectedCountry || filteredCountries[0]}
              />
            )}
          </>
        ) : (
          <ul>
            {filteredCountries.map((country) => (
              <li key={country.cca3}>
                {country.name.common}{" "}
                <button onClick={() => handleShowCountry(country)}>show</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const CountryDetails = ({ country }) => {
  return (
    <div>
      <h3>
        <b>{country.name.common}</b>
      </h3>
      <p>Capital: {country.capital ? country.capital[0] : "N/A"}</p>
      <p>Area: {country.area} km²</p>
      <h4>Languages:</h4>
      <ul>
        {country.languages ? (
          Object.values(country.languages).map((language, index) => (
            <li key={index}>{language}</li>
          ))
        ) : (
          <li>N/A</li>
        )}
      </ul>
      <img
        src={country.flags.svg}
        alt={`Flag of ${country.name.common}`}
        width="200"
      />
    </div>
  );
};

const WeatherDetails = ({ weather, country }) => {
  return (
    <div>
      <h3>Weather in {country.name.common}</h3>
      <p>Temperature: {weather.main.temp} °C</p>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
        alt={weather.weather[0].description}
      />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
};

export default App;
