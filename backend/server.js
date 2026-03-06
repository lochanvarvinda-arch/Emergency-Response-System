const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("incidents.db");

db.run(`
  CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    lat REAL,
    lng REAL,
    severity TEXT,
    priority INTEGER,
    eta TEXT,
    status TEXT
  )
`);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/incidents", (req, res) => {
  db.all("SELECT * FROM incidents ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch incidents" });
    }
    res.json(rows);
  });
});

app.post("/report", (req, res) => {
  const { type, lat, lng, severity } = req.body;

  let priority;
  let eta;
  let status = "Responder Assigned";

  if (severity === "High") {
    priority = 95;
    eta = "4 mins";
  } else if (severity === "Medium") {
    priority = 70;
    eta = "7 mins";
  } else {
    priority = 40;
    eta = "10 mins";
  }

  db.run(
    `INSERT INTO incidents (type, lat, lng, severity, priority, eta, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [type, lat, lng, severity, priority, eta, status],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to store incident" });
      }

      res.json({
        message: "Incident stored successfully",
        incident: {
          id: this.lastID,
          type,
          lat,
          lng,
          severity,
          priority,
          eta,
          status
        }
      });
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});