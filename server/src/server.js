const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://etanamiolatunji:LBBMgk7t7stvEKLd@cluster0.8exxbvs.mongodb.net/";

mongoose.connection.once("open", () => {
  console.log("MongoDB connected!");
});

mongoose.connection.on("error", err => {
  console.error(err)
})

const server = http.createServer(app);

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}

startServer();
