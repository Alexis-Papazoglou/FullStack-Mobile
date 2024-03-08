const express = require("express");
const getRouter = express.Router();

//test server with hello
getRouter.route("/hello").get((req, res) => {
  res.json({ message: "Hello World" });
});

module.exports = getRouter;
