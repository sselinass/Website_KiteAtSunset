// Konstante für Zeitumwandlung
const unixToTime = (unix) => {
    return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


// Konstanten aus dem HTML-Dokument
const selectedWeatherData = document.querySelector('#locations');


// Daten der API abfragen
async function loadAllWeatherData() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=54,46.4,28.3,43,53&longitude=10,9.7,-14,3,-9&daily=sunset&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m&forecast_days=1&timeformat=unixtime'; // mit korrekter API-URL ersetzen
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
        windSpeed: data.hourly.wind_speed_10m,
        windDirection: data.hourly.wind_direction_10m,
        sunset: unixToTime(data.daily.sunset[0]), // nur das erste Element verwenden
        longitude: data.longitude,
        latitude: data.latitude,
        sunsetIndex: sunsetIndex
    });
}); 
console.log(sortedData)



// Daten über DOM in HTML einfügen
let outputHTML = '';

sortedData.forEach(data => {
    outputHTML += `
    <div class="myLocations">
        <h2>Temperatur: ${data.temperature[data.sunsetIndex]}°</h2>
        <h2>Windgeschwindigkeit: ${data.windSpeed[data.sunsetIndex]} km/h</h2>
        <h2>Windrichtung: ${data.windDirection[data.sunsetIndex]}°</h2>
        <h2>Sonnenuntergang: ${data.sunset}</h2>
        <p>-------</p>
    </div>`;
});

selectedWeatherData.innerHTML = outputHTML;