const apiKey = '146a49bc76bbe8d605a48683680e3e0d'; // Replace with your API key

const suggestionsEl = document.getElementById('suggestions');
const inputEl = document.getElementById('locationInput');
const weatherEl = document.getElementById('weather');

const cityList = [
  'New York, USA',
  'London, UK',
  'Paris, France',
  'Tokyo, Japan',
  'Mumbai, India',
  'Sydney, Australia',
  'Berlin, Germany',
  'Moscow, Russia',
  'Beijing, China',
  'Cairo, Egypt'
];

// Show suggestions below input as user types
inputEl.addEventListener('input', () => {
  const inputVal = inputEl.value.toLowerCase();
  if (!inputVal) {
    suggestionsEl.innerHTML = '';
    return;
  }

  const filtered = cityList.filter(city =>
    city.toLowerCase().startsWith(inputVal)
  ).slice(0, 5);

  suggestionsEl.innerHTML = filtered.length
    ? `<ul class="suggestions-list">${filtered.map(city => `<li>${city}</li>`).join('')}</ul>`
    : '';

  // Add click event to suggestions
  document.querySelectorAll('.suggestions-list li').forEach(item => {
    item.addEventListener('click', () => {
      inputEl.value = item.textContent;
      suggestionsEl.innerHTML = '';
    });
  });
});

// Weather background mapping
const backgrounds = {
  Clear: "url('backgrounds/Clear Sky.mp4')",
  Clouds: "url('https://source.unsplash.com/1600x900/?cloudy,sky')",
  Rain: "url('https://source.unsplash.com/1600x900/?rain,rainy')",
  Thunderstorm: "url('backgrounds/ThunderStorm.mp4')",
  Snow: "url('backgrounds/Snow.mp4')",
  Mist: "url('https://source.unsplash.com/1600x900/?fog,mist')",
  Drizzle: "url('https://source.unsplash.com/1600x900/?drizzle,rain')"
};

const setBackground = (condition) => {
  const bg = backgrounds[condition] || "url('https://source.unsplash.com/1600x900/?weather')";
  
  // Smooth fade transition
  const body = document.body;
  body.style.transition = 'background-image 1.5s ease-in-out';
  body.style.backgroundImage = bg;
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = 'center';
};

const displayWeather = (data) => {
  const tempC = (data.main.temp - 273.15).toFixed(1);
  const condition = data.weather[0].main;

  document.getElementById('city').textContent = data.name + ', ' + (data.sys.country || '');
  document.getElementById('temp').textContent = `${tempC} °C`;
  document.getElementById('condition').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('wind').textContent = `Wind: ${(data.wind.speed * 3.6).toFixed(1)} km/h`;

  setBackground(condition);
};

const showError = (msg) => {
  document.getElementById('city').textContent = 'Error';
  document.getElementById('temp').textContent = msg;
  document.getElementById('condition').textContent = '--';
  document.getElementById('humidity').textContent = '--';
  document.getElementById('wind').textContent = '--';
};

const getWeatherByCity = () => {
  const city = inputEl.value.trim();
  if (!city) return showError('Enter a city');

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`)
    .then(res => {
      if(!res.ok) {
        throw new Error('City not found');
      }
      return res.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(err => {
      showError(err.message);
    });
};

