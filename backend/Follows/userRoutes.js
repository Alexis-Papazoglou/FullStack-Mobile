const express = require("express");
const router = express.Router();
const { followUser, unfollowUser } = require("./followUserRoute");

router.route("/followUser/:username/:userToFollowUsername").post(followUser);
router.route("/unfollowUser/:username/:userToUnfollowUsername").post(unfollowUser);

module.exports = router;
