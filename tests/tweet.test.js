const dbHandler = require("./db-handler");
const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");

// handle scrubbing databases between tests
beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

const user1Data = {
  firstname: "test",
  lastname: "test",
  email: "test@gmail.com",
  password: "testpass",
};
const fakeMongoId = mongoose.Types.ObjectId();

describe("unit testing basic operations", () => {
  test("valid post", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const postTweet = await request
      .post("/tweets")
      .set({ token: user1.body.token })
      .send({
        content: "my first tweet",
      });
    expect(postTweet.statusCode).toBe(201);
  });
  test("invalid post, no content", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const postTweet = await request
      .post("/tweets")
      .set({ token: user1.body.token })
      .send({});
    expect(postTweet.statusCode).toBe(400);
  });

  test("invalid post, content doesn't fit tweet (1-255 char) specs", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const postTweet = await request
      .post("/tweets")
      .set({ token: user1.body.token })
      .send({ content: "" });
    expect(postTweet.statusCode).toBe(400);
  });

  test("valid get", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const postTweet = await request
      .post("/tweets")
      .set({ token: user1.body.token })
      .send({
        content: "my first tweet",
      });
    const getTweet = await request
      .get("/tweets/me")
      .set({ token: user1.body.token });
    expect(getTweet.statusCode).toBe(200);
  });

  test("invalid get, incorrect tweetId", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const postTweet = await request
      .post("/tweets")
      .set({ token: user1.body.token })
      .send({
        content: "my first tweet",
      });
    const getTweet = await request
      .get("/tweets/" + fakeMongoId)
      .set({ token: user1.body.token });
    expect(getTweet.statusCode).toBe(400);
  });

  test("valid update", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const postTweet = await request
      .post("/tweets")
      .set({ token: user1.body.token })
      .send({
        content: "my first tweet",
      });

    const updateTweet = await request
      .put("/tweets/" + postTweet.body.id)
      .set({ token: user1.body.token })
      .send({
        content: "my first updated tweet",
      });
    const getUpdatedTweet = await request
      .get("/tweets/" + postTweet.body.id)
      .set({ token: user1.body.token });
    expect(postTweet.statusCode).toBe(201);
    expect(updateTweet.statusCode).toBe(200);
    expect(getUpdatedTweet.statusCode).toBe(200);
  });

  test("invalid update, incorrect tweetId", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const postTweet = await request
      .post("/tweets")
      .set({ token: user1.body.token })
      .send({
        content: "my first tweet",
      });

    const updateTweet = await request
      .put("/tweets/" + fakeMongoId)
      .set({ token: user1.body.token })
      .send({
        content: "my first updated tweet",
      });
    const getUpdatedTweet = await request
      .get("/tweets/" + postTweet.body.id)
      .set({ token: user1.body.token });
    expect(postTweet.statusCode).toBe(201);
    expect(updateTweet.statusCode).toBe(400);
    expect(getUpdatedTweet.statusCode).toBe(200);
  });

  test("valid delete", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const postTweet = await request
      .post("/tweets")
      .set({ token: user1.body.token })
      .send({
        content: "my first tweet",
      });
    const deleteTweet = await request
      .delete("/tweets/" + postTweet.body.id)
      .set({ token: user1.body.token });

    expect(deleteTweet.statusCode).toBe(200);
  });

  test("invalid delete", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const postTweet = await request
      .post("/tweets")
      .set({ token: user1.body.token })
      .send({
        content: "my first tweet",
      });
    const deleteTweet = await request
      .delete("/tweets/" + fakeMongoId)
      .set({ token: user1.body.token });

    expect(deleteTweet.statusCode).toBe(400);
  });
});
