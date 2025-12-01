const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const mongoose_URL = "mongodb://127.0.0.1:27017/My_Trip";

main()
.then(() => {
    console.log("connected to DB");
})
.catch(err => {
    console.log(err)
}) 

async function main() {
    await mongoose.connect(mongoose_URL);
}

const initDB = async() =>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68b141ec8dcb614ab0839974"}))
    await listing.insertMany(initData.data);
    console.log("data was intialized")
}

initDB();