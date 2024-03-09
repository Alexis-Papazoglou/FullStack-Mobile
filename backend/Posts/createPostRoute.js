const Post = require("../models/Post");

const createPost = async (req, res, next) => {
  const { title, description, username } = req.body;
  try {
    const post = await Post.create({
      title,
      description,
      username,
    });
    res.status(200).json({
      message: "Post successfully created",
      post,
    });

    // require is here because the route is initialized before the socket connection
    const io = require("../sockets/connection").getIo();

    // Emit 'new post' event to all connected clients
    io.emit("new post", "A new post was created");
    console.log("Post creation signal sent!");
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Post not successful created",
      error: err.message,
    });
  }
};

module.exports = { createPost };
