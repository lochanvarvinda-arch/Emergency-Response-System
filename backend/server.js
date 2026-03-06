const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let incidents = [];

// API to get incidents
app.get("/incidents", (req, res) => {
    res.json(incidents);
});

// API to report incident
app.post("/report", (req, res) => {

    const incident = {
        id: incidents.length + 1,
        type: req.body.type,
        lat: req.body.lat,
        lng: req.body.lng,
        severity: req.body.severity
    };

    incidents.push(incident);

    res.json({
        message: "Incident added succesfully",
        incident: incident
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
