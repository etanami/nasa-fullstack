const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

//const launches = new Map();

let flightNumber = 100;

const launch = {
  flightNumber: 100,
  lauchDate: new Date("February 21, 2024"),
  mission: "Space X",
  rocket: "Explorer IS1",
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

//launches.set(launch.flightNumber, launch);

function existsLaunch(launchId) {
  return launches.has(launchId);
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if(!planet) {
    throw new Error("Planet doesn't exist");
  }

  await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

function addNewLaunch(launch) {
  flightNumber++;
  launches.set(
    flightNumber,
    Object.assign(launch, {
      flightNumber,
      customer: ["Zero To Mastery", "NASA"],
      upcoming: true,
      success: true,
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.success = false;
  aborted.upcoming = false;
  return aborted;
}

module.exports = {
  existsLaunch,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
