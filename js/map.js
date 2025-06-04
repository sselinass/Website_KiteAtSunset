// ZEITUMWANDLUNG
const unixToTime = (unix, timezone) => {
    return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone });
};


// Konstanten aus dem HTML-Dokument
let spotsActual = document.querySelector('#containerSpots');


// ----------- 
// API DATEN
// -----------

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


// ----------- 
// SONNENUNTERGANG DATEN FINDEN
// -----------

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

// ----------- 
// ZUSATZINFORMATIONEN FÜR SPOTS
// -----------

const spotInfo = [
    {
      lat: 54.0,
      lng: 10.0,
      name: "Kiel, DEU",
      description: "heute bei Sonnenuntergang in Kiel erwartet dich:",
      image: "assets/img/hamburg_n.jpeg"
    },
    {
      lat: 46.4,
      lng: 9.68,
      name: "Silvaplana, CHE",
      description: "heute bei Sonnenuntergang in Silvaplana erwartet dich:",
      image: "assets/img/silvaplana_n.jpeg"
    },
    {
      lat: 28.3,
      lng: -14.0,
      name: "Fuerteventura, ESP",
      description: "heute bei Sonnenuntergang in Fuerteventura erwartet dich:",
      image: "assets/img/fuerteventura_n.jpeg"
    },
    {
      lat: 43.0,
      lng: 3.0,
      name: "Leucate, FRA",
      description: "heute bei Sonnenuntergang in Leucate erwartet dich:",
      image: "assets/img/narbonne_n.jpeg"
    },
    {
      lat: 53.0,
      lng: -9.0,
      name: "Galway, IRL",
      description: "heute bei Sonnenuntergang in Galway erwartet dich:",
      image: "assets/img/galway_n.jpeg"
    }
  ];

// -----------
// DATEN AUS API AUWÄHLEN
// ----------

let sortedData = [];
allWeatherData.forEach(data => {
    let sunsetUnix = data.daily.sunset[0];
    let sunsetIndex = findClosestHourIndex(data.hourly.time, sunsetUnix);

    // passend Spot finden mit Koordinaten
    const match = spotInfo.find(spot =>
        Math.abs(spot.lat - data.latitude) < 0.01 && Math.abs(spot.lng - data.longitude) < 0.01
    );

    sortedData.push({
        temperature: data.hourly.temperature_2m[sunsetIndex],
        temperatureActual: data.current.temperature_2m,
        windSpeed: data.hourly.wind_speed_10m[sunsetIndex],
        windSpeedActual: data.current.wind_speed_10m,
        windDirection: data.hourly.wind_direction_10m[sunsetIndex],
        windDirectionActual: data.current.wind_direction_10m,
        sunset: unixToTime(data.daily.sunset[0], data.timezone),
        time: unixToTime(data.current.time, data.timezone),
        longitude: data.longitude,
        latitude: data.latitude,
        sunsetIndex: sunsetIndex,

        // zusätzliche Informationen einfügen
        name: match?.name || "Unknown Spot",
        description: match?.description || "No description available.",
        image: match?.image || "assets/imgs/default.jpg"
    });
});
console.log(sortedData)


// ----------- 
// MAP PAGE
// -----------

// leaflet.js Karte initialisieren
const map = L.map('map').setView([50, 10], 4);
      
// OpenStreetMap "Filter" Layer hinzufügen
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);
  

// Marker Icon erstellen 
const customIcon = L.icon({
    iconUrl: 'assets/img/kiteschirm.png', 
    iconSize: [35, 35],                  
    iconAnchor: [16, 32],                // point of the icon which corresponds to the marker's location
    popupAnchor: [0, -32]                // point from which the popup should open relative to the iconAnchor
  });


// Popup/Marker für jeden Spot hinzufügen
sortedData.forEach(spot => {
    const popupContent = `
        <strong>${spot.name}</strong><br>
        <img src="${spot.image}" alt="${spot.name}" style="width: 100%; max-height: 180px; object-fit: cover; border-radius: 8px;" /><br>
        <em>${spot.description}</em><br>
        Temperatur: ${spot.temperature}°C<br>
        Wind: ${spot.windSpeed} km/h<br>
        Windrichtung: ${spot.windDirection}°<br>
        Sonnenuntergang: ${spot.sunset}
    `;

    L.marker([spot.latitude, spot.longitude], {icon: customIcon})
        .addTo(map)
        .bindPopup(popupContent);
});