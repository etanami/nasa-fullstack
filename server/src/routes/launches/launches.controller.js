const { getAllLaunches, addNewLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpPostLaunch(req, res) {
  const launch = req.body;

  // Return error if input data is empty
  if(!launch) {
    res.status(404).json("Incomplete fields!")
  }

  // Format input date using date function
  launch.launchDate = new Date(launch.launchDate);

  // Add new launch into model
  addNewLaunch(launch);
  // Return OK status with input data
  res.status(201).json(launch);
}

module.exports = {
  httpGetAllLaunches,
  httpPostLaunch
};
