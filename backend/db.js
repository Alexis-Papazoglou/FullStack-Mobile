const Mongoose = require("mongoose");
const DB_CONNECTION = process.env.DB_CONNECTION || "mongodb://localhost:27017/";
const connectDB = async () => {
  await Mongoose.connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB Connected");
};
module.exports = connectDB;
