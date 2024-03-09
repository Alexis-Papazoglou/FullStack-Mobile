const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    return res.status(401).json({ message: "Access denied. Token is required." });
  }

  const bearer = bearerHeader.split(" ");
  const token = bearer[1];

  // Verify token
  jwt.verify(token, "a", (err, decoded) => {
    if (err) {
      if (err.message === "jwt expired") {
        console.log(err.message);
        return res.status(401).json({ message: "expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
    // Token is valid, proceed to the next middleware or route handler
    next();
  });
};

module.exports = verifyToken;
