const express = require("express");
const router = express.Router();
const { createPost } = require("./createPostRoute");
const { getPosts } = require("./getPostsRoute");

router.route("/create").post(createPost);
router.route("/getPosts").get(getPosts);

module.exports = router;
