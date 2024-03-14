const Mongoose = require("mongoose");

// add likes and comments to the schema
const CommentSchema = new Mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const LikeSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

const PostSchema = new Mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  comments: [CommentSchema],
  likes: [LikeSchema],
});

const Post = Mongoose.model("post", PostSchema);
module.exports = Post;
