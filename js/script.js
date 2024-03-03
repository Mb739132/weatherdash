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

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value.trim();
  if (city) {
    await saveToSearchHistory(city); // Save searched city to localStorage
    const currentWeather = await fetchWeather(city);
    const forecast = await fetchForecast(city);
    // Display current weather and forecast
    // (Implementation of display functions is not provided in the code snippet)
    showSearchHistory(); // Update search history display
  } else {
    alert('Please enter a city name');
  }
}

// Add event listener to form submit
document.getElementById('search-form').addEventListener('submit', handleFormSubmit);