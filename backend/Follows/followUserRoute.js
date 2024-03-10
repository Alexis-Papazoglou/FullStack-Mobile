const User = require("../models/User");

const followUser = async (req, res, next) => {
  const username = req.params.username;
  const userToFollowUsername = req.params.userToFollowUsername;

  try {
    const user = await User.findOne({ username: username });
    user.following.push(userToFollowUsername);
    await user.save();

    res.status(200).json({
      message: "Followed successfully",
      following: user.following,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred",
      error: err.message,
    });
  }
};

const unfollowUser = async (req, res, next) => {
  const username = req.params.username;
  const userToUnfollowUsername = req.params.userToUnfollowUsername;

  try {
    const user = await User.findOneAndUpdate(
      { username: username },
      { $pull: { following: userToUnfollowUsername } },
      { new: true }
    );

    res.status(200).json({
      message: "Unfollowed successfully",
      following: user.following,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred",
      error: err.message,
    });
  }
};

module.exports = { followUser, unfollowUser };
