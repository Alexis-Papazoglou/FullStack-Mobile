const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const connectDB = require("./db");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.DB_CONNECTION = mongoUri;
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

test("MongoDB Connected", async () => {
  const isConnected = mongoose.connection.readyState;
  expect(isConnected).toBe(1);
});
