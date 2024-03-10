const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const PORT = 3000;

const connectDB = require("./db");
connectDB();

app.use(express.json());

// -- Middleware Routes -- //

// verification route
// used to verify the token
app.use(
  "/verifyToken",
  require("./tokenVerification/tokenVerificationMiddleware"),
  require("./tokenVerification/tokenVerificationRoute")
);

app.use(
  "/posts",
  require("./tokenVerification/tokenVerificationMiddleware"),
  require("./Posts/postsRoutes")
);

app.use(
  "/users",
  require("./tokenVerification/tokenVerificationMiddleware"),
  require("./Follows/userRoutes")
);

//Authentication routes
app.use("/auth", require("./Authentication/AuthRoute"));

const io = require("./sockets/connection").init(server);

// Server connection and handling
server.listen(PORT, () => console.log("Running on port:", PORT));

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
});
