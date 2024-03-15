const request = require("supertest");
const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const User = require("../models/User");
const authRoutes = require("./AuthRoute");

let mongoServer;
const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

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

test("POST /auth/register creates a new user", async () => {
  const response = await request(app)
    .post("/auth/register")
    .send({ username: "testuser", password: "testpassword" });
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("User successfully created");
});

test("POST /auth/login logs in a user", async () => {
  const user = new User({ username: "testuser1", password: "testpassword" });
  await user.save();
  const response = await request(app)
    .post("/auth/login")
    .send({ username: "testuser", password: "testpassword" });
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("Login successful");
});
