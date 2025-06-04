# IM 2 - Dokumentation Projektarbeit

## Kite At Sunset

ein Projekt von Selina Schöpfer, mmp24b

Webseite: https://im2.selina-schoepfer.ch

# Kurzbeschreibung des Projekts

In meinem Projekt habe ich mit der API open-meteo.com gearbeitet. Mein Ziel war es, einen etwas anderen Kite Guide aufzugleisen. Ziel war es, einen Guide zu erstellen, bei dem man wichtige Informationen für eine Kite Session bei Sonnenuntergang erhält. 

Dazu wollte ich folgende Elemente aus meiner API einbringen:
- Sonnenuntergang Zeit
- aktuelle Zeit
- verschiedene Orte 
- Windgeschwindigkeit & Windrichtung
- Temperatur 

fehlende Daten wie etwa Fotos von den Kite Orten und Beschreibungen sowie einen Kite Schirm Guide (Grösse und Empfehlung für Windstärke) brachte ich zusätzlich noch selbst ein. 

Beispiel:
Wenn ich in Silvaplana kiten gehen möchte, erfahre ich bereits auf der Start Karte die Informationen für eine Kite Session bei Sonnenuntergang. Auf der Spots Seite sehe ich dann einen Übersicht aller aufgeführten Spots - zur aktuellen Zeit, für eine spontane Session, oder per Klick nochmals die Daten bei Sonnenuntergang. Habe ich mich dann für einen Ort entschieden, gilt es die richtige Kite Grösse auszuwählen - diese finde ich dann ganz einfach auf der KiteGuide Seite heraus, indem ich den Ort anwähle. Somit erhalte ich die empfohlene Kite Grösse für die herrschenden Windverhältnisse bei Sonnenuntergang. 

Erweiterungsmöglichkeiten:
momentan ist die Seite auf 5 Destination beschränkt, dies könnte jedoch ausgeweitet werden, sei dies in Europa oder mehrerer Kite Plätze in einem Land. Ebenfalls ist der KiteGuide momentan für eine:n durchschnittliche:n Kiter:in erstellt - dies könnte man ausbauen um noch Körpergrösse/Gewicht anzugeben. 

Parameter:
- Koordinaten
- Zeit
- Sonnenuntergang (Zeit)
- Temperatur aktuell / Temperatur bei Sonnenuntergang
- Windgeschwindigkeit aktuell / Windgeschwindigkeit bei Sonnenuntergang
- Windrichtung aktuell / Windrichtung bei Sonnenungergang 

API:
https://open-meteo.com 


# Learnings und Schwierigkeiten

Ich traf auf einige Schwierigkeiten beim Auswerten der Daten wie z. B. das Umwandeln der Unixtime und dem Zuordnen der stündlichen Daten zur Sonnenuntergangszeit. Ebenfalls hatte ich anfangs Schwierigkeiten, das Gelernte in JavaScript umzusetzen. Zweimal kriegte ich den JavaScript Code nicht zu laufen, da ich alles im gleichen js file erarbeiten wollte. Es dauerte etwas, bis ich (mit Coaching Hilfe) darauf kam, dass nicht der Code an sich das Problem war, sondern dass etwas oberhalb im Code blockierte. In solchen Fällen war ich extrem auf die Coaching oder ChatGPT angewiesen, um meine Gedanken auszuführen. Ich konnte mich aber sehr gut in JavaScript einarbeiten und verstehe nun die Arbeitsschritte oder habe einen für mich passenden Weg gefunden, diese mit diversen Hilfen zu "umgehen". Ich legte dieses Semester bereits von Anfang an grossen Wert auf die Ordnung im Code, was mir sehr zu Nutzen kam. 


# benutzte Ressourcen und Prompts

Für mein Projekt habe ich folgende Ressourcen als Unterstützung genutzt: 

primär
- Coachingtage direkt vor Ort 
    - Unterstützung für: Zeitumrechnung, Daten zum Sonnenuntergang finden und anzeigen, allgemein API einbetten, uvm. 
- Mitstudierende haben mir immer wieder geholfen wenn ich auf Schwierigkeiten gestossen bin 

sekundär
- W3schools: https://www.w3schools.com/css/default.asp
- ChatGPT: zur Unterstützung für die Einbettung der leaflet Karte sowie JavaScript Schritte zum erfolgreichen Anzeigen und Verknüpfen komplexeren Arbeitsschritte
- leafletjs.com: https://leafletjs.com/ für Karte auf Hauptseite sowie Marker und Pop Up's
- GitHub Copilot: einfache Strukturaufgaben konnte ich so schneller und effizienter ausführen sowie gewisse Styling Vorschläge anwenden