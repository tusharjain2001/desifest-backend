const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
}));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("DESIFEST Backend Running 🚀");
});

// Routes
const volunteerRoute = require("./routes/volunteer");
app.use("/api", volunteerRoute);

const artistRoute = require("./routes/artist");
app.use("/api", artistRoute);

const contactRoute = require("./routes/contact");
app.use("/api", contactRoute);

// Export the Express app for Vercel
module.exports = app;