const Post = require("../models/Post");

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

module.exports = { getPosts };
