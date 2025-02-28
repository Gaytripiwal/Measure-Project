const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    // Clear existing data
    await Listing.deleteMany({});
    console.log("Existing data cleared.");

    // Add owner field to each object
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner:'6789fa0d2f5650b8a89ddfbc', // Ensuring it's an ObjectId
    }));
  
    // Insert the updated data into the database
    await Listing.insertMany(initData.data);
    console.log("Data was initialized.");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

initDB();