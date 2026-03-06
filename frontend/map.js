var map = L.map('map').setView([13.0827,80.2707],13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'© OpenStreetMap'
}).addTo(map);

var incidentCount = 0;

function reportEmergency(){

incidentCount++;

var lat = 13.0827 + (Math.random()-0.5)*0.02;
var lng = 80.2707 + (Math.random()-0.5)*0.02;

var severityLevels = ["Low","Medium","High"];
var severity = severityLevels[Math.floor(Math.random()*3)];

L.marker([lat,lng])
.addTo(map)
.bindPopup("Incident "+incidentCount+"<br>Severity: "+severity)
.openPopup();

var list = document.getElementById("incidentList");

var item = document.createElement("li");

item.innerHTML = "Incident "+incidentCount+" | Severity: "+severity;

list.appendChild(item);

}