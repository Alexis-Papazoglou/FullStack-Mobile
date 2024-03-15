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

beforeEach(async () => {
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
  postId = response.body.post.id;
});

test("POST /likePost likes a post", async () => {
  const response = await request(httpServer)
    .post("/likePost")
    .set("Authorization", `Bearer ${token}`)
    .send({
      postId,
      username: "testuser",
    });
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("post");
  expect(response.body.post.likes).toEqual(
    expect.arrayContaining([expect.objectContaining({ username: "testuser" })])
  );
});

test("POST /likePost dislikes a post", async () => {
  // First, like the post
  await request(httpServer)
    .post("/likePost")
    .set("Authorization", `Bearer ${token}`)
    .send({
      postId,
      username: "testuser",
    });

  // Then, dislike the post
  const response = await request(httpServer)
    .post("/likePost")
    .set("Authorization", `Bearer ${token}`)
    .send({
      postId,
      username: "testuser",
    });

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("post");
  expect(response.body.post.likes.some((like) => like.username === "testuser")).toBe(
    false
  );
});

test("POST /commentPost comments on a post", async () => {
  const commentText = "test comment";
  const response = await request(httpServer)
    .post("/commentPost")
    .set("Authorization", `Bearer ${token}`)
    .send({
      postId,
      username: "testuser",
      commentText,
    });
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("post");
  expect(response.body.post.comments).toContainEqual(
    expect.objectContaining({
      username: "testuser",
      comment: commentText,
    })
  );
});
