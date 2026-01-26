const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Volunteer Backend Running 🚀");
});

// Routes
const volunteerRoute = require("./routes/volunteer");
app.use("/api", volunteerRoute);

const artistRoute = require("./routes/artist");
app.use("/api", artistRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
