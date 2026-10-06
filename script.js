const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const description = document.getElementById("description");
const message = document.getElementById("message");


// Search button
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    getWeather(city);
});


// Press Enter to search
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});


// Main weather function
async function getWeather(city) {

    try {
        message.textContent = "Loading weather...";

        // Step 1: Find city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to find city.");
        }

        const geoData = await geoResponse.json();

        // Check whether city exists
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather data could not be fetched.");
        }

        const weatherData = await weatherResponse.json();

        // Step 3: Extract nested JSON data
        const current = weatherData.current;

        // Step 4: Display data
        cityName.textContent =
            `${location.name}, ${location.country}`;

        temperature.textContent =
            current.temperature_2m;

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        feelsLike.textContent =
            `${current.apparent_temperature}°C`;

        description.textContent =
            getWeatherDescription(current.weather_code);

        message.textContent = "";

    } catch (error) {

        console.error(error);

        message.textContent =
            error.message || "Something went wrong.";

        cityName.textContent = "Weather Dashboard";
        temperature.textContent = "--";
        humidity.textContent = "--%";
        windSpeed.textContent = "-- km/h";
        feelsLike.textContent = "--°C";
        description.textContent = "--";
    }
}


// Convert weather code into readable text
function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1 || code === 2 || code === 3) {
        return "Partly cloudy";
    }

    if (code === 45 || code === 48) {
        return "Fog";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown weather";
}