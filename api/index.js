const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("DESIFEST Backend Running 🚀");
});

// Routes
app.use("/api", require("./routes/volunteer"));
app.use("/api", require("./routes/artist"));
app.use("/api", require("./routes/contact"));

// ✅ START SERVER ONLY LOCALLY
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// ✅ Export for Vercel
module.exports = app;
