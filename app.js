const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Object to store sensor data for each drone by ID
const sensorDataStorage = {};

// Route to receive data from a specific drone by ID
app.post("/data/:droneId", (req, res) => {
  const { droneId } = req.params;
  const data = req.body;

  // Store or update sensor data for this specific drone ID
  sensorDataStorage[droneId] = data;

  console.log(`Data received for drone ${droneId}:`, data);
  res.json({ message: `Data for drone ${droneId} received successfully` });
});

// Route to retrieve data for a specific drone by ID
// app.get("/data/:droneId", (req, res) => {
//   const { droneId } = req.params;
//   const data = sensorDataStorage[droneId];

//   if (data) {
//     res.json(data);
//   } else {
//     res.status(404).json({ error: `No data found for drone ${droneId}` });
//   }
// });
const droneId = "drone1"; // Replace with the actual drone ID
const endpoint = `http://localhost:5000/data/${droneId}`;
const fetchData = async () => {
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      console.error(`No data found for drone ${droneId}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Poll the endpoint every second
setInterval(fetchData, 1000);

// Route to retrieve the latest data for all drones
app.get("/latest_data", (req, res) => {
  res.json(sensorDataStorage);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
