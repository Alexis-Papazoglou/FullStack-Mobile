const Mongoose = require("mongoose");

const PostSchema = new Mongoose.Schema({
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
});

const Post = Mongoose.model("post", PostSchema);
module.exports = Post;
