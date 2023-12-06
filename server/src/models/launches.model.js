const launches = new Map();

let flightNumber = 100;

const launch = {
  flightNumber: 100,
  lauchDate: new Date("February 21, 2024"),
  mission: "Space X",
  rocket: "Explorer IS1",
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
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

module.exports = {
  getAllLaunches,
  addNewLaunch,
};
