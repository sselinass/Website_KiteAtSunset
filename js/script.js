// Konstante für Zeitumwandlung
const unixToTime = (unix, timezone) => {
    return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone });
};


// Konstanten aus dem HTML-Dokument
const locationsAtSunset = document.querySelector('#locationsAtSunset');
const locationsActual = document.querySelector('#locationsActual');


// Daten der API abfragen
async function loadAllWeatherData() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=54,46.4,28.3,43,53&longitude=10,9.7,-14,3,-9&daily=sunset&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m&current=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=Europe%2FBerlin,Europe%2FBerlin,Europe%2FBerlin,Europe%2FBerlin,Europe%2FDublin&forecast_days=1&timeformat=unixtime'; // mit korrekter API-URL ersetzen
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
        return false;
    }
}
const allWeatherData = await loadAllWeatherData();
console.log(allWeatherData);


// Hilfsfunktion: Finde Index der Stunde, die dem Sonnenuntergang am nächsten ist
function findClosestHourIndex(hourlyTimestamps, sunsetTimestamp) {
    let closestIndex = 0;
    let minDiff = Infinity;

    hourlyTimestamps.forEach((timestamp, i) => {
        const diff = Math.abs(timestamp - sunsetTimestamp);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
        }
    });

    return closestIndex;
}


// Daten aus der API auswählen
let sortedData = [];
allWeatherData.forEach(data => {
    let sunsetUnix = data.daily.sunset[0]
    let sunsetIndex = findClosestHourIndex(data.hourly.time, sunsetUnix)
    
    sortedData.push({
        temperature: data.hourly.temperature_2m,
        temperatureActual: data.current.temperature_2m,
        windSpeed: data.hourly.wind_speed_10m,
        windSpeedActual: data.current.wind_speed_10m,
        windDirection: data.hourly.wind_direction_10m,
        windDirectionActual: data.current.wind_direction_10m,
        sunset: unixToTime(data.daily.sunset[0], data.timezone), // nur das erste Element verwenden
        time: unixToTime(data.current.time, data.timezone), // nur das erste Element verwenden
        longitude: data.longitude,
        latitude: data.latitude,
        sunsetIndex: sunsetIndex
    });
}); 
console.log(sortedData)



// Daten über DOM in HTML einfügen
let locationsAtSunsetHTML = '';

sortedData.forEach(data => {
    locationsAtSunsetHTML += `
    <div class="myLocations">
        <h2>Zeit aktuell: ${data.time}</h2>
        <h2>Temperatur: ${data.temperature[data.sunsetIndex]}°</h2>
        <h2>Windgeschwindigkeit: ${data.windSpeed[data.sunsetIndex]} km/h</h2>
        <h2>Windrichtung: ${data.windDirection[data.sunsetIndex]}°</h2>
        <h2>Sonnenuntergang: ${data.sunset}</h2>
        <p>-------</p>
    </div>`;
});

locationsAtSunset.innerHTML = locationsAtSunsetHTML;

let locationsActualHTML = '';

sortedData.forEach(data => {
    locationsActualHTML += `
    <div class="myLocations">
        <h2>Zeit aktuell: ${data.time}</h2>
        <h2>Temperatur: ${data.temperatureActual}°</h2>
        <h2>Windgeschwindigkeit: ${data.windSpeedActual} km/h</h2>
        <h2>Windrichtung: ${data.windDirectionActual}°</h2>
        <h2>Sonnenuntergang: ${data.sunset}</h2>
        <p>-------</p>
    </div>`;
});

locationsActual.innerHTML = locationsActualHTML;


// leaflet.js Karte initialisieren

// Initialize the map
const map = L.map('map').setView([50, 10], 4);
      
// Add OpenStreetMap tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);
  

// kite spots
const kiteSpots = [
    {
        name: "Kiel, DE",
        lat: 54.0,
        lng: 10.0,
        description: "Coastal city on the Baltic Sea, known for steady winds and great kiteboarding.",
        sunset: "Sonnenuntergang:",
        wind: "Wind:",
        windDirection: "Windrichtung:"
    },
    {
        name: "Silvaplana, CH",
        lat: 46.4,
        lng: 9.68,
        description: "Beautiful alpine lake with thermal winds and stunning mountain views.",
        sunset: "Sonnenuntergang:",
        wind: "Wind:",
        windDirection: "Windrichtung:"
    },
    {
        name: "Fuerteventura, ES",
        lat: 28.3,
        lng: -14.0,
        description: "A top destination for year-round kiting and golden beaches.",
        sunset: "Sonnenuntergang:",
        wind: "Wind:",
        windDirection: "Windrichtung:"
    },
    {
        name: "Leucate, FRA",
        lat: 43.0,
        lng: 3.0,
        description: "Strong Tramontana winds, flat water lagoons, and a top freestyle destination.",
        sunset: "Sonnenuntergang:",
        wind: "Wind:",
        windDirection: "Windrichtung:"
    },
    {
        name: "Lahinch, IRL",
        lat: 53.0082,
        lng: -9.008316,
        description: "Wild Atlantic vibes with strong wind and great wave riding potential.",
        sunset: "Sonnenuntergang:",
        wind: "Wind:",
        windDirection: "Windrichtung:"
    }
];
  
// markers
kiteSpots.forEach(spot => {
    L.marker([spot.lat, spot.lng])
        .addTo(map)
        .bindPopup(`<strong>${spot.name}</strong><br>${spot.description}<br>${spot.sunset}${spot.wind}${spot.windDirection}`);
});