const Post = require("../models/Post");
const User = require("../models/User");

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: "Posts successfully retrieved",
      posts,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Posts not successfully retrieved",
      error: err.message,
    });
  }
};

const getFollowingPosts = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username: username });
    const posts = await Post.find({ username: { $in: user.following } });

    res.status(200).json({
      message: "Posts retrieved successfully",
      posts: posts,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred",
      error: err.message,
    });
  }
};

module.exports = { getPosts, getFollowingPosts };
