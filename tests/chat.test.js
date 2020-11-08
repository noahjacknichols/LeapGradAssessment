const dbHandler = require("./db-handler");
const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

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

const user2Data = {
  firstname: "test2",
  lastname: "test2",
  email: "test2@gmail.com",
  password: "testpass2",
};

describe("chat unit testing", () => {
  test("post request no logged in user, to user1 id", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const user1Obj = await request
      .get("/users/me")
      .set({ token: user1.body.token });
    const badAttempt = await request.get("/messages/" + user1Obj.body.id).send({
      content: "hello",
    });
    expect(badAttempt.statusCode).toBe(401);
  });

  test("post request logged in user, to no user", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const user1Obj = await request
      .get("/users/me")
      .set({ token: user1.body.token });
    const user1SendMessage = await request
      .post("/messages/" + "fakeuserId")
      .set({ token: user1.body.token })
      .send({
        content: "hello",
      });
    expect(user1SendMessage.statusCode).toBe(400);
  });

  test("post request logged in user, no content", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const user2 = await request.post("/auth/register").send(user2Data);
    const user1Obj = await request
      .get("/users/me")
      .set({ token: user1.body.token });
    const user2Obj = await request
      .get("/users/me")
      .set({ token: user2.body.token });
    const user1SendMessage = await request
      .post("/messages/" + user2Obj.body.id)
      .set({ token: user1.body.token })
      .send({});
    expect(user1SendMessage.statusCode).toBe(400);
  });
});

describe("chat tests", () => {
  test("user1 checks chat with user2, but no message to user2 yet", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const user2 = await request.post("/auth/register").send(user2Data);
    const user2Obj = await request
      .get("/users/me")
      .set({ token: user2.body.token });

    const user1ChecksMessage = await request
      .get("/messages/" + user2Obj.body.id)
      .set({ token: user1.body.token });
    expect(user1ChecksMessage.statusCode).toBe(200);
    expect(user1ChecksMessage.body).toMatchObject([]);
  });

  test("user1 sends user2 message", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const user2 = await request.post("/auth/register").send(user2Data);
    const user1Obj = await request
      .get("/users/me")
      .set({ token: user1.body.token });
    const user2Obj = await request
      .get("/users/me")
      .set({ token: user2.body.token });

    const user1SendMessage = await request
      .post("/messages/" + user2Obj.body.id)
      .set({ token: user1.body.token })
      .send({
        content: "hello",
      });

    expect(user1SendMessage.statusCode).toBe(200);
  });

  test("user2 replies to user1", async () => {
    const user1 = await request.post("/auth/register").send(user1Data);
    const user2 = await request.post("/auth/register").send(user2Data);
    const user1Obj = await request
      .get("/users/me")
      .set({ token: user1.body.token });
    const user2Obj = await request
      .get("/users/me")
      .set({ token: user2.body.token });

    const user1SendMessage = await request
      .post("/messages/" + user1Obj.body.id)
      .set({ token: user2.body.token })
      .send({
        content: "hello to you too",
      });

    expect(user1SendMessage.statusCode).toBe(200);
  });
});
