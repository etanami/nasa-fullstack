const express = require("express");
const cors = require('cors');

const planetsRouter = require("./routes/planets.route");

const app = express();

// Allow CORS policy
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use(express.json());
app.use(planetsRouter);

module.exports = app;
