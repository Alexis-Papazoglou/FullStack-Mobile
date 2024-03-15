const request = require("supertest");
const express = require("express");
const { Server } = require("http");
const { Server: SocketIOServer } = require("socket.io");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const postsRoutes = require("./postsRoutes");
const bodyParser = require("body-parser");

// Require the connection module
const connection = require("../sockets/connection");

let mongoServer;
const app = express();
app.use(bodyParser.json());

let httpServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Set up HTTP server and Socket.io
  httpServer = new Server(app);

  // Initialize the Socket.io instance in the connection module
  connection.init(httpServer);
});

app.use("/", postsRoutes);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();

  // Close HTTP server and Socket.io
  httpServer.close();
});

const token = jwt.sign({ userId: "testUserId" }, "a");

let postId;

test("POST /create creates a new post", async () => {
  const response = await request(httpServer)
    .post("/create")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "test title",
      description: "test description",
      username: "testuser",
      likes: [{ username: "testuser", text: "test like" }],
      comments: [{ username: "testuser", text: "test comment" }],
    });
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("post");
  postId = response.body.post.id;
  expect(response.body.post.title).toBe("test title");
  expect(response.body.post.description).toBe("test description");
  expect(response.body.post.username).toBe("testuser");
  if (response.body.post.likes.length > 0) {
    expect(response.body.post.likes[0].username).toBe("testuser");
    expect(response.body.post.likes[0].text).toBe("test like");
  }
  if (response.body.post.comments.length > 0) {
    expect(response.body.post.comments[0].username).toBe("testuser");
    expect(response.body.post.comments[0].text).toBe("test comment");
  }
});
