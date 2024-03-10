const express = require("express");
const router = express.Router();
const { createPost } = require("./createPostRoute");
const { getPosts, getFollowingPosts } = require("./getPostsRoute");

router.route("/create").post(createPost);
router.route("/getPosts").get(getPosts);
router.route("/getFollowingPosts/:username").get(getFollowingPosts);

module.exports = router;
