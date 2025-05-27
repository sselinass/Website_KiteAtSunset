// Konstante für Zeitumwandlung
const unixToTime = (unix, timezone) => {
    return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone });
};


// Konstanten aus dem HTML-Dokument
let spotsActual = document.querySelector('#containerSpots');


// ----------- 
// API DATEN
// -----------

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

// Zusatzinfo für die Spots
const spotInfo = [
    {
      lat: 54.0,
      lng: 10.0,
      name: "Kiel, DEU",
      description: "heute bei Sonnenuntergang in Kiel erwartet dich:",
      image: "assets/img/hamburg_n.jpeg",
      imageDay: "assets/img/hamburg_d.jpeg"
    },
    {
      lat: 46.4,
      lng: 9.68,
      name: "Silvaplana, CHE",
      description: "heute bei Sonnenuntergang in Silvaplana erwartet dich:",
      image: "assets/img/silvaplana_n.jpeg",
      imageDay: "assets/img/silvaplana_d.jpeg"
    },
    {
      lat: 28.3,
      lng: -14.0,
      name: "Fuerteventura, ES",
      description: "heute bei Sonnenuntergang in Fuerteventura erwartet dich:",
      image: "assets/img/fuerteventura_n.jpeg",
      imageDay: "assets/img/fuerteventura_d.jpeg"
    },
    {
      lat: 43.0,
      lng: 3.0,
      name: "Leucate, FRA",
      description: "heute bei Sonnenuntergang in Leucate erwartet dich:",
      image: "assets/img/narbonne_n.jpeg",
      imageDay: "assets/img/narbonne_d.jpeg"
    },
    {
      lat: 53.0,
      lng: -9.0,
      name: "Galway, IRL",
      description: "heute bei Sonnenuntergang in Galway erwartet dich:",
      image: "assets/img/galway_n.jpeg",
      imageDay: "assets/img/galway_d.jpeg"
    }
  ];


// Daten aus der API auswählen
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
        image: match?.image || "assets/imgs/default.jpg",
        imageDay: match?.imageDay || "assets/imgs/default_day.jpg"
    });
});
console.log(sortedData)

// -----------
// SPOTS PAGE
// ----------  


// Daten über DOM in HTML einfügen

let dataForSpotsHTML = '';
sortedData.forEach(data => {
    dataForSpotsHTML += 
    `<div class="spotCard" data-name="Galway, IRL">
                <img src="${data.imageDay}" alt="Galway">
                <div class="spotInfo">
                    <p>Zeit aktuell: ${data.time}</p>
                    <p>Temperatur: ${data.temperatureActual}°</p>
                    <p>Windgeschwindigkeit: ${data.windSpeed} km/h</p>
                    <p>Windrichtung: ${data.windDirection}°</p>
                    <p>Sonnenuntergang: ${data.sunset}</p>
                </div>
     </div>
    `;
});


spotsActual.innerHTML = dataForSpotsHTML;