const axios = require("axios");

const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

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

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading launch data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      lauchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    // console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const isLaunchLoaded = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (isLaunchLoaded) {
    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDB.findOne(filter);
}

async function existsLaunch(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDB.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  await launchesDB.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("Planet doesn't exist");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["Zero To Mastery", "NASA"],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDB.updateOne(
    {
      flightNumber: launchId,
    },
    {
      success: false,
      upcoming: false,
    }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  existsLaunch,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
