// ROUTES FOR COMMENT AND LIKE OF A SPECIFIC POST
// THE ROUTES EMMIT A SOCKET EVENT TO THE FRONTEND TO UPDATE THE SPECIFIC POST (REFETCH THE POST)

const Post = require("../models/Post");
const { v4: uuidv4 } = require("uuid");

const handleLikePost = async (req, res, next) => {
  const { postId, username } = req.body;
  try {
    const post = await Post.findOne({ id: postId });
    const alreadyLiked = post.likes.filter((like) => like.username === username);
    if (alreadyLiked.length > 0) {
      // dislike the post
      post.likes = post.likes.filter((like) => like.username !== username);
      await post.save();
      res.status(200).json({
        message: "Post successfully disliked",
        post,
      });
    } else {
      // like the post
      post.likes.push({ username });
      await post.save();
      res.status(200).json({
        message: "Post successfully liked",
        post,
      });
    }
    const io = require("../sockets/connection").getIo();
    io.emit("post actions", { message: "Post like", id: post.id });
    console.log("Post actions signal sent!");
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Action not successful",
      error: err.message,
    });
  }
};

const handleCommentPost = async (req, res, next) => {
  const { postId, username, commentText } = req.body;
  try {
    const post = await Post.findOne({ id: postId });
    post.comments.push({
      username,
      comment: commentText,
      id: uuidv4().toString(),
      timestamp: new Date().toISOString(),
    });
    await post.save();
    res.status(200).json({
      message: "Comment successfully added",
      post,
    });
    const io = require("../sockets/connection").getIo();
    io.emit("post actions", { message: "Post comment", id: post.id });
    console.log("Post actions signal sent!");
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Action not successful",
      error: err.message,
    });
  }
};

module.exports = { handleLikePost, handleCommentPost };
