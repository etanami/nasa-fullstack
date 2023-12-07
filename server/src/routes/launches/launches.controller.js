const {
  getAllLaunches,
  addNewLaunch,
  existsLaunch,
  abortLaunchById,
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpPostLaunch(req, res) {
  const launch = req.body;

  // Return error if any input data is empty
  if (
    !launch.mission ||
    !launch.launchDate ||
    !launch.target ||
    !launch.rocket
  ) {
    return res.status(400).json({
      error: "Missing required launch property!",
    });
  }

  // Format input date using date function and check if it's valid
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date!",
    });
  }

  // Add new launch into model
  addNewLaunch(launch);
  // Return OK status with input data
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  if (!existsLaunch(launchId)) {
    return res.status(404).json({
      error: "Launch not found!",
    });
  }

  const aborted = abortLaunchById(launchId);
  res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch,
};
