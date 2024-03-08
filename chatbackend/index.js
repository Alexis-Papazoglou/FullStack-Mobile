const express = require("express");
const app = express();
const PORT = 3000;

const connectDB = require("./db");
connectDB();

app.use(express.json());

// -- Middleware Routes -- //

//general routes (e.x hello route)
app.use(
  "/get",
  require("./Authentication/tokenVerificationMiddleware"),
  require("./HelloRouter")
);

//Authentication routes
app.use("/auth", require("./Authentication/AuthRoute"));

// Server connection and handling
app.listen(PORT, () => console.log("Running on port:", PORT));

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
});
