const express = require("express");
const router = express.Router();
const { createPost } = require("./createPostRoute");
const { getPosts, getFollowingPosts, getPostById } = require("./getPostsRoute");
const { handleLikePost, handleCommentPost } = require("./postActionsRoute");

router.route("/create").post(createPost);
router.route("/getPosts").get(getPosts);
router.route("/getFollowingPosts/:username").get(getFollowingPosts);
router.route("/getPostById/:id").get(getPostById);
router.route("/likePost").post(handleLikePost);
router.route("/commentPost").post(handleCommentPost);

module.exports = router;
