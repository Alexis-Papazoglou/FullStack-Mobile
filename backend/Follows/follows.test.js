const request = require("supertest");
const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const User = require("../models/User");
const followRoutes = require("./userRoutes");
const jwt = require("jsonwebtoken");

let mongoServer;
const app = express();
app.use(express.json());
app.use("/", followRoutes);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test("POST /followUser/:username/:userToFollowUsername follows a user", async () => {
  const user = new User({
    username: "testuser1",
    password: "testpassword",
    following: [],
  });
  await user.save();
  const userToFollow = new User({
    username: "testuser2",
    password: "testpassword",
    following: [],
  });
  await userToFollow.save();

  const token = jwt.sign({ userId: user._id }, "a");

  const response = await request(app)
    .post(`/followUser/${user.username}/${userToFollow.username}`)
    .set("Authorization", `Bearer ${token}`);
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("Followed successfully");
  expect(response.body.following).toContain(userToFollow.username);
});

test("POST /unfollowUser/:username/:userToUnfollowUsername unfollows a user", async () => {
  const user = new User({
    username: "testuser3",
    password: "testpassword",
    following: ["testuser4"],
  });
  await user.save();
  const userToUnfollow = new User({
    username: "testuser4",
    password: "testpassword",
    following: [],
  });
  await userToUnfollow.save();

  const token = jwt.sign({ userId: user._id }, "a");

  const response = await request(app)
    .post(`/unfollowUser/${user.username}/${userToUnfollow.username}`)
    .set("Authorization", `Bearer ${token}`);
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("Unfollowed successfully");
  expect(response.body.following).not.toContain(userToUnfollow.username);
});
