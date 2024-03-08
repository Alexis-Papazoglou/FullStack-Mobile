const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    return res.status(401).json({ message: "Access denied. Token is required." });
  }

  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  console.log(token);
  // Verify token
  jwt.verify(token, "a", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Access denied. Invalid token." });
    }

    // Check token expiration
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: "Access denied. Token expired." });
    }

    // Token is valid, proceed to the next middleware or route handler
    next();
  });
};

module.exports = verifyToken;
