// const mongoose=require("mongoose");
// const initData=require("./data.js");
// const Listing=require("../models/listing.js");
// main().then(()=>{
//     console.log("connected to the DB");
// }).catch((err)=>{
//     console.log(err)
// })
// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// }
// const initDB=async ()=>{
//    await  Listing.deleteMany({});//to delete if there is any sample data inserted previously
//     await Listing.insertMany(initData.data);//module.exports = { data: sampleListings };
//     console.log("data was initialised");
// }
// initDB();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to DataBase");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner: '6773cadb33c8aba52de96cb4'}));
  await Listing.insertMany(initData.data);
  console.log("data initialized");
};
initDB();