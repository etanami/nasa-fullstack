const express = require("express");

const { httpGetAllLaunches } = require("./launches.controller");
const { httpPostLaunch } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpPostLaunch);

module.exports = launchesRouter;
