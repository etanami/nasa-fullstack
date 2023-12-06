const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

// array to store the habitable planets data from the stream
const habitablePlanets = [];

const isHabitable = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data.csv"));
    const stream = readStream.pipe(
      parse({
        comment: "#",
        columns: true,
      })
    );

    stream.on("data", (data) => {
      if (isHabitable(data)) {
        habitablePlanets.push(data);
      }
    });

    stream.on("error", (err) => {
      console.log(err);
      reject();
    });

    stream.on("end", () => {
      console.log(`${habitablePlanets.length} habitable planets found!`);
      resolve();
    });
  });
}

function getAllPlanets() {
  return habitablePlanets;
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
}