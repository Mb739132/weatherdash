// Require node-fetch
const fetch = require('node-fetch');

// Define API key for OpenWeatherMap API
const API_KEY = '88bf17f81aa94d02894a5af319d04012';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Function to fetch weather data from API by city name
async function fetchWeather(city) {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Function to fetch forecast data from API by city name
async function fetchForecast(city) {
  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return null;
  }
}

// Function to save searched city to localStorage
function saveToSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
}

// Function to display search history
function showSearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  const searchHistoryElement = document.getElementById('search-history');
  searchHistoryElement.innerHTML = `
      <h2>Search History</h2>
      <ul>
          ${searchHistory.map(city => `<li>${city}</li>`).join('')}
      </ul>
  `;
}

// Function to display weather data
function displayWeather(weatherData) {
  const weatherContainer = document.getElementById('weather-container');
  weatherContainer.innerHTML = ''; // Clear previous weather data
  
  weatherData.forEach(data => {
    const weatherItem = document.createElement('div');
    weatherItem.classList.add('weather-item');
  
    const day = document.createElement('p');
    day.textContent = data.day;
  
    const temperature = document.createElement('p');
    temperature.textContent = `Temperature: ${data.temperature}`;
  
    const weather = document.createElement('p');
    weather.textContent = `Weather: ${data.weather}`;
  
    weatherItem.appendChild(day);
    weatherItem.appendChild(temperature);
    weatherItem.appendChild(weather);
  
    weatherContainer.appendChild(weatherItem);
  });
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value.trim();
  if (city) {
    await saveToSearchHistory(city); // Save searched city to localStorage
    const currentWeather = await fetchWeather(city);
    const forecast = await fetchForecast(city);
    // Combine current weather and forecast data (for demonstration purposes)
    const weatherData = [
      { day: "Today", temperature: currentWeather.main.temp, weather: currentWeather.weather[0].main },
      { day: "Tomorrow", temperature: forecast.list[0].main.temp, weather: forecast.list[0].weather[0].main }
    ];
    displayWeather(weatherData); // Display weather data
    showSearchHistory(); // Update search history display
  } else {
    // If city name is not provided, attempt to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        const currentWeather = {
          main: {
            temp: data.main.temp
          },
          weather: [{
            main: data.weather[0].main
          }]
        };
        const forecast = await fetchForecast(data.name);
        // Combine current weather and forecast data (for demonstration purposes)
        const weatherData = [
          { day: "Today", temperature: currentWeather.main.temp, weather: currentWeather.weather[0].main },
          { day: "Tomorrow", temperature: forecast.list[0].main.temp, weather: forecast.list[0].weather[0].main }
        ];
        displayWeather(weatherData); // Display weather data
        showSearchHistory(); // Update search history display
      }, error => {
        console.error('Error getting current location:', error);
        alert('Failed to get current location. Please enter a city name.');
      });
    } else {
      alert('Geolocation is not supported by this browser. Please enter a city name.');
    }
  }
}

// Add event listener to form submit
document.getElementById('search-form').addEventListener('submit', handleFormSubmit);