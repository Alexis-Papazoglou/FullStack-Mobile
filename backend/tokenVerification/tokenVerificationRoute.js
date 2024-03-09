const express = require("express");
const getRouter = express.Router();

//test server with hello
getRouter.route("/").get((req, res) => {
  res.json({ message: "token ok" });
});

module.exports = getRouter;
