const Post = require("../models/Post");
const { v4: uuidv4 } = require("uuid");

const createPost = async (req, res, next) => {
  const { title, description, username } = req.body;
  try {
    const post = await Post.create({
      id: uuidv4().toString(),
      title,
      description,
      username,
      timestamp: new Date().toISOString(),
    });

    // require is here because the route is initialized before the socket connection
    const io = require("../sockets/connection").getIo();

    // Emit 'new post' event to all connected clients
    io.emit("new post", { message: "A new post was created", id: post.id });
    console.log("Post creation signal sent!");

    res.status(200).json({
      message: "Post successfully created",
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Post not successful created",
      error: err.message,
    });
  }
};

module.exports = { createPost };
