// Initialize map
var map = L.map('map').setView([13.0827,80.2707],13);

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
 attribution:'© OpenStreetMap contributors'
}).addTo(map);


// Example starting emergency
L.marker([13.0827,80.2707])
.addTo(map)
.bindPopup("🚗 Accident<br>Severity: High");


// Function called when button is pressed
function reportEmergency(){

let type = document.getElementById("type").value;
let severity = document.getElementById("severity").value;


// For demo we generate a random nearby location
let lat = 13.0827 + (Math.random() * 0.02 - 0.01);
let lng = 80.2707 + (Math.random() * 0.02 - 0.01);


// Data sent to backend
let emergencyData={
type:type,
lat:lat,
lng:lng,
severity:severity
};


// Send to your friend's backend
fetch("http://localhost:3000/report",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(emergencyData)
})
.then(res=>res.json())
.then(data=>{

console.log("Stored in backend:",data);

// Add marker to map
L.marker([lat,lng])
.addTo(map)
.bindPopup("🚨 "+type+"<br>Severity: "+severity)
.openPopup();

})
.catch(err=>{
console.error("Backend error:",err);
});

}