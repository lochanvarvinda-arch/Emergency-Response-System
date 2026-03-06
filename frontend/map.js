const BASE_URL = "http://localhost:3000";

const map = L.map("map").setView([13.0827, 80.2707], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 19
}).addTo(map);

const incidentList = document.getElementById("incidentList");
const incidentCount = document.getElementById("incidentCount");
const totalIncidents = document.getElementById("totalIncidents");
const highCount = document.getElementById("highCount");
const messageBox = document.getElementById("message");
const reportBtn = document.getElementById("reportBtn");
const sosBtn = document.getElementById("sosBtn");

const heroType = document.getElementById("heroType");
const heroDetails = document.getElementById("heroDetails");
const heroSeverity = document.getElementById("heroSeverity");
const heroEta = document.getElementById("heroEta");
const heroStatus = document.getElementById("heroStatus");
const heroPriority = document.getElementById("heroPriority");

const markersLayer = L.layerGroup().addTo(map);

console.log("map.js loaded");
console.log("reportBtn:", reportBtn);
console.log("sosBtn:", sosBtn);

function getSeverityColor(severity) {
  if (severity === "High") return "red";
  if (severity === "Medium") return "orange";
  return "green";
}

function updateHeroCard(incidents) {
  if (!heroType) return;

  if (incidents.length === 0) {
    heroType.textContent = "No active incidents";
    heroDetails.textContent = "Report an emergency to begin live monitoring.";
    heroSeverity.textContent = "--";
    heroEta.textContent = "--";
    heroStatus.textContent = "--";
    heroPriority.textContent = "--";
    return;
  }

  const topIncident = [...incidents].sort((a, b) => b.priority - a.priority)[0];

  heroType.textContent = topIncident.type;
  heroDetails.textContent = `Coordinates: ${Number(topIncident.lat).toFixed(4)}, ${Number(topIncident.lng).toFixed(4)}`;
  heroSeverity.textContent = topIncident.severity;
  heroEta.textContent = topIncident.eta;
  heroStatus.textContent = topIncident.status;
  heroPriority.textContent = `Priority ${topIncident.priority}`;
}

function renderIncidents(incidents) {
  markersLayer.clearLayers();
  if (incidentList) incidentList.innerHTML = "";

  if (incidentCount) incidentCount.textContent = incidents.length;
  if (totalIncidents) totalIncidents.textContent = incidents.length;
  if (highCount) highCount.textContent = incidents.filter(i => i.severity === "High").length;

  incidents.forEach((incident) => {
    const color = getSeverityColor(incident.severity);

    L.circleMarker([incident.lat, incident.lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.85,
      radius: 8,
      weight: 2
    })
      .addTo(markersLayer)
      .bindPopup(`
        <b>${incident.type}</b><br>
        Severity: ${incident.severity}<br>
        Priority: ${incident.priority}<br>
        ETA: ${incident.eta}<br>
        Status: ${incident.status}
      `);

    if (incidentList) {
      const item = document.createElement("div");
      item.className = "incident-item";
      item.innerHTML = `
        <div class="incident-top">
          <span class="incident-type">${incident.type}</span>
          <span class="badge ${incident.severity.toLowerCase()}">${incident.severity}</span>
        </div>
        <div class="coords">Lat: ${Number(incident.lat).toFixed(4)}, Lng: ${Number(incident.lng).toFixed(4)}</div>
        <div class="coords">Priority: ${incident.priority} | ETA: ${incident.eta}</div>
        <div class="coords">Status: ${incident.status}</div>
      `;
      incidentList.appendChild(item);
    }
  });

  updateHeroCard(incidents);
}

async function loadIncidents() {
  try {
    console.log("GET /incidents");
    const res = await fetch(`${BASE_URL}/incidents`);
    const incidents = await res.json();
    console.log("Loaded incidents:", incidents);
    renderIncidents(incidents);
    if (messageBox) messageBox.textContent = "";
  } catch (error) {
    console.error("Error loading incidents:", error);
    if (messageBox) messageBox.textContent = "Backend not reachable.";
  }
}

async function sendIncident(payload, successMessage) {
  try {
    console.log("POST payload:", payload);
    if (messageBox) messageBox.textContent = "Sending incident...";

    const res = await fetch(`${BASE_URL}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("POST response:", data);

    if (messageBox) messageBox.textContent = successMessage;
    await loadIncidents();
  } catch (error) {
    console.error("Error reporting incident:", error);
    if (messageBox) messageBox.textContent = "Could not connect to backend.";
  }
}

function reportEmergency() {
  const typeEl = document.getElementById("type");
  const severityEl = document.getElementById("severity");

  const type = typeEl ? typeEl.value : "Fire";
  const severity = severityEl ? severityEl.value : "High";

  const lat = 13.0827 + (Math.random() * 0.02 - 0.01);
  const lng = 80.2707 + (Math.random() * 0.02 - 0.01);

  const payload = { type, lat, lng, severity };
  sendIncident(payload, "Incident reported successfully.");
}

function sendSOS() {
  const lat = 13.0827 + (Math.random() * 0.02 - 0.01);
  const lng = 80.2707 + (Math.random() * 0.02 - 0.01);

  const payload = {
    type: "SOS Emergency",
    lat: lat,
    lng: lng,
    severity: "High"
  };

  sendIncident(payload, "SOS emergency sent successfully.");
}

if (reportBtn) {
  reportBtn.addEventListener("click", reportEmergency);
}

if (sosBtn) {
  sosBtn.addEventListener("click", sendSOS);
}

loadIncidents();