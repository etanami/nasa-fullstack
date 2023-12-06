const express = require("express");

const { getAllLaunches } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/launch", getAllLaunches);

module.exports = launchesRouter;
