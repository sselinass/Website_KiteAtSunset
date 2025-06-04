console.log("Script loaded");

// ZEITUMWANDLUNG
const unixToTime = (unix, timezone) => {
    return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone });
};


// DOM ELEMENTE HTML
const locationSelect = document.getElementById("kiteLocationSelect");
const kiteInfoBox = document.getElementById("kiteInfoBox");
const kiteElements = document.querySelectorAll(".kite");


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

const spotInfo = [
    {
      lat: 54.0,
      lng: 10.0,
      name: "Kiel, DEU",
      descriptionGuide: "heute in <strong>Kiel</strong> bei Sonnenuntergang braucht es für eine:n durchschnittliche:n Kiter:in:",
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
      descriptionGuide: "heute in <strong>Silvaplana</strong> bei Sonnenuntergang braucht es für eine:n durchschnittliche:n Kiter:in:",
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
      descriptionGuide: "heute in <strong>Fuerteventura</strong> bei Sonnenuntergang braucht es für eine:n durchschnittliche:n Kiter:in:",
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
      descriptionGuide: "heute in <strong>Leucate</strong> bei Sonnenuntergang braucht es für eine:n durchschnittliche:n Kiter:in:",
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
      descriptionGuide: "heute in <strong>Galway</strong> bei Sonnenuntergang braucht es für eine:n durchschnittliche:n Kiter:in:",
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
        descriptionGuide: match?.descriptionGuide || "No guide description available.",
        description: match?.description || "No description available.",
        descriptionNight: match?.descriptionNight || "No description available at night.",
        descriptionDay: match?.descriptionDay || "No description available during the day.",
        image: match?.image || "assets/imgs/default.jpg",
        imageDay: match?.imageDay || "assets/imgs/default_day.jpg"
    });
});
console.log(sortedData)

// -----------
// Kitegrössenempfehlung basierend auf Windgeschwindigkeit
// -----------

function getRecommendedKite(windSpeedKmH) {
    if (windSpeedKmH >= 65) {
        return "7 m²";
    } else if (windSpeedKmH >= 53) {
        return "8 m²";
    } else if (windSpeedKmH >= 46) {
        return "9 m²";
    } else if (windSpeedKmH >= 37) {
        return "10 m²";
    } else if (windSpeedKmH >= 22) {
        return "12 m²";
    } else {
        return "heute leider keine Kite Session - zu wenig Wind";
    }
}

// -----------
// KITE GUIDE
// -----------

locationSelect.addEventListener("change", () => {
    const selectedName = locationSelect.value;

    // falls keine Location ausgewählt ist
    if (!selectedName) {
        kiteInfoBox.innerHTML = "Bitte wähle einen Standort.";
        kiteElements.forEach(el => el.classList.remove("selected"));
        return;
    }

    // passenden Spot finden
    const spot = sortedData.find(s => s.name.includes(selectedName));

    if (!spot) {
        kiteInfoBox.innerHTML = "Keine Wetterdaten gefunden.";
        return;
    }

    // Windgeschwindigkeit bei Sonnenuntergang in km/h
    const windSpeedAtSunsetKmH = spot.windSpeed;

    // empfohlene Kite-Größe ermitteln
    const recommendedKite = getRecommendedKite(windSpeedAtSunsetKmH);

    // Rückmeldung aktualisieren
    kiteInfoBox.innerHTML = `
        <p>${spot.descriptionGuide}</p>
        <p><strong>Empfohlene Kite-Grösse:</strong> ${recommendedKite}</p>
        <p><strong>Windgeschwindigkeit bei Sonnenuntergang:</strong> ${windSpeedAtSunsetKmH} km/h</p>
    `;

    kiteElements.forEach(el => {
        el.classList.remove("selected");
        if (recommendedKite.includes(el.dataset.size)) {
            el.classList.add("selected");
        }
    });
});