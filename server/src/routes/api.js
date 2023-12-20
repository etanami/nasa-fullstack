const express = require("express");

const planetsRouter = require("./planets/planets.route");
const launchesRouter = require("./launches/launches.route");

const api = express();

api.use("/planets", planetsRouter);
api.use("/launch", launchesRouter);

module.exports = api;