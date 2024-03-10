const Mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 4,
    required: true,
  },
  following: [
    {
      type: String,
      ref: "user",
    },
  ],
});

UserSchema.plugin(uniqueValidator);
const User = Mongoose.model("user", UserSchema);
module.exports = User;
