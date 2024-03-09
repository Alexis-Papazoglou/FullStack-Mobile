const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server);

    io.use((socket, next) => {
      const token = socket.handshake.query.token;
      jwt.verify(token, "a", (err, decoded) => {
        if (err) {
          next(new Error("Authentication error"));
        } else {
          next();
        }
      });
    });

    io.on("connection", (socket) => {
      console.log("a user connected to the sockets");

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
