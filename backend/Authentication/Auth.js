const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const TOKEN_EXPIRATION_SECONDS = 360;

const register = async (req, res, next) => {
  if (req.body.username !== undefined && req.body.password !== undefined) {
    const { username, password } = req.body;
    if (password.length < 4) {
      return res.status(400).json({ message: "Password less than 6 characters" });
    }
    bcrypt.hash(password, 10).then(async (hash) => {
      try {
        const user = await User.create({
          username,
          password: hash,
        });

        // Generate JWT token
        const tokenValue = jwt.sign({ userId: user._id }, "a", {
          expiresIn: TOKEN_EXPIRATION_SECONDS + "s",
        });

        res.status(200).json({
          message: "User successfully created",
          user,
          token: {
            value: tokenValue,
            expiration: TOKEN_EXPIRATION_SECONDS,
          },
        });
      } catch (err) {
        console.log(err);
        res.status(401).json({
          message: "User not successful created",
          error: err.message,
        });
      }
    });
  } else {
    res.status(401).send("No username or password provided");
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    }

    // Comparing given password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        message: "Login not successful",
        error: "Invalid username/password",
      });
    }

    // Generate JWT token
    const tokenValue = jwt.sign({ userId: user._id }, "a", {
      expiresIn: TOKEN_EXPIRATION_SECONDS + "s",
    });

    // Send token and user in response
    res.status(200).json({
      message: "Login successful",
      token: {
        value: tokenValue,
        expiration: TOKEN_EXPIRATION_SECONDS,
      },
      user,
    });
    return;
    //handle errors
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

module.exports = { register, login };
