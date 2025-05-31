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
      descriptionNight: "bei Sonnenuntergang",
      descriptionDay: "aktuell",
      image: "assets/img/hamburg_n.jpeg",
      imageDay: "assets/img/hamburg_d.jpeg"
    },
    {
      lat: 46.4,
      lng: 9.68,
      name: "Silvaplana, CHE",
      description: "heute bei Sonnenuntergang in Silvaplana erwartet dich:",
      descriptionNight: "bei Sonnenuntergang",
      descriptionDay: "aktuell",
      image: "assets/img/silvaplana_n.jpeg",
      imageDay: "assets/img/silvaplana_d.jpeg"
    },
    {
      lat: 28.3,
      lng: -14.0,
      name: "Fuerteventura, ESP",
      description: "heute bei Sonnenuntergang in Fuerteventura erwartet dich:",
      descriptionNight: "bei Sonnenuntergang",
      descriptionDay: "aktuell",
      image: "assets/img/fuerteventura_n.jpeg",
      imageDay: "assets/img/fuerteventura_d.jpeg"
    },
    {
      lat: 43.0,
      lng: 3.0,
      name: "Leucate, FRA",
      description: "heute bei Sonnenuntergang in Leucate erwartet dich:",
      descriptionNight: "bei Sonnenuntergang",
      descriptionDay: "aktuell",
      image: "assets/img/narbonne_n.jpeg",
      imageDay: "assets/img/narbonne_d.jpeg"
    },
    {
      lat: 53.0,
      lng: -9.0,
      name: "Galway, IRL",
      description: "heute bei Sonnenuntergang in Galway erwartet dich:",
      descriptionNight: "bei Sonnenuntergang",
      descriptionDay: "aktuell",
      image: "assets/img/galway_n.jpeg",
      imageDay: "assets/img/galway_d.jpeg"
    }
  ];


// -----------
// DATEN AUS API AUWÄHLEN
// ----------

let sortedData = [];
allWeatherData.forEach(data => {
    let sunsetUnix = data.daily.sunset[0];
    let sunsetIndex = findClosestHourIndex(data.hourly.time, sunsetUnix);

    // passenden Spot finden mit Koordinaten
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
        descriptionNight: match?.descriptionNight || "No description available at night.",
        descriptionDay: match?.descriptionDay || "No description available during the day.",
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
    `<div class="spotCard"
         data-name="${data.name}"
         data-image-day="${data.imageDay}"
         data-image-night="${data.image}"
         data-temp-day="${data.temperatureActual}"
         data-temp-night="${data.temperature}"
         data-wind-day="${data.windSpeedActual}"
         data-wind-night="${data.windSpeed}"
         data-dir-day="${data.windDirectionActual}"
         data-dir-night="${data.windDirection}"
         data-description="${data.description}"
         data-description-night="${data.descriptionNight}"
         data-description-day="${data.descriptionDay}">

        <img src="${data.imageDay}" alt="${data.name}">
        <div class="spotInfo">
            <h1><strong>${data.name}</strong></h1>
            <h3 class="description" style="display: none;">${data.descriptionNight}</h3>    
            <p class="time">lokale Zeit: ${data.time}</p>
            <p class="temp">Temperatur: ${data.temperatureActual}°</p>
            <p class="wind">Windgeschwindigkeit: ${data.windSpeedActual} km/h</p>
            <p class="dir">Windrichtung: ${data.windDirectionActual}°</p>
            <p class="sunset">Sonnenuntergang: ${data.sunset}</p>
        </div>
     </div>`;
});


spotsActual.innerHTML = dataForSpotsHTML;



document.querySelectorAll('.spotCard').forEach(card => {
    let isNight = false;

    card.addEventListener('click', () => {
        isNight = !isNight;

        const img = card.querySelector('img');
        const temp = card.querySelector('.temp');
        const wind = card.querySelector('.wind');
        const dir = card.querySelector('.dir');
        const desc = card.querySelector('.description');

        if (isNight) {
            card.classList.add('night');
            desc.style.display = 'block';
            img.src = card.dataset.imageNight;
            temp.textContent = `Temperatur: ${card.dataset.tempNight}°`;
            wind.textContent = `Windgeschwindigkeit: ${card.dataset.windNight} km/h`;
            dir.textContent = `Windrichtung: ${card.dataset.dirNight}°`;
        } else {
            card.classList.remove('night');
            img.src = card.dataset.imageDay;
            temp.textContent = `Temperatur: ${card.dataset.tempDay}°`;
            wind.textContent = `Windgeschwindigkeit: ${card.dataset.windDay} km/h`;
            dir.textContent = `Windrichtung: ${card.dataset.dirDay}°`;
            desc.style.display = 'none';
        }
    });
});