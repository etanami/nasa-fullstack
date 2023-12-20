const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://etanamiolatunji:LBBMgk7t7stvEKLd@cluster0.8exxbvs.mongodb.net/";

mongoose.connection.once("open", () => {
  console.log("MongoDB connected!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect(MONGO_URL);
}

module.exports = { mongoConnect, mongoDisconnect };
