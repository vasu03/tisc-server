require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const routes = require("./routes");
const errorHandler = require("./middleware/error.middleware");

const fetchThreatFox = require("./services/threatfox.service");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use("/", routes);

// Error Handler
app.use(errorHandler);

// Background Job
setInterval(fetchThreatFox, process.env.FETCH_INTERVAL || 300000);

// Initial fetch
fetchThreatFox();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
