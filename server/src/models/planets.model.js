const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

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
    const readStream = fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    );
    const stream = readStream.pipe(
      parse({
        comment: "#",
        columns: true,
      })
    );

    stream.on("data", async (data) => {
      if (isHabitable(data)) {
        await savePlanet(data);
      }
    });

    stream.on("error", (err) => {
      console.log(err);
      reject();
    });

    stream.on("end", async () => {
      const numberOfPlanetsFound = (await getAllPlanets()).length;
      console.log(`${numberOfPlanetsFound} habitable planets found!`);
      resolve();
    });
  });
}

async function getAllPlanets() {
  return await planets.find({});
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
