const dbHandler = require("./db-handler");
const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

// handle scrubbing databases between tests
beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("user creation", () => {
  test("can be created", async () => {
    const response = await request.post("/auth/register").send({
      firstname: "test",
      lastname: "test",
      email: "test@gmail.com",
      password: "testpass",
    });
    expect(response.statusCode).toBe(201);
  });

  test("creating duplicate user", async (done) => {
    var response = await request.post("/auth/register").send({
      firstname: "test",
      lastname: "test",
      email: "test@gmail.com",
      password: "testpass",
    });
    response = await request.post("/auth/register").send({
      firstname: "test",
      lastname: "test",
      email: "test@gmail.com",
      password: "testpass",
    });
    expect(response.statusCode).toBe(400);
    done();
  });
});

describe("user creation with missing / wrong information", () => {
  test("can be created with missing info", async () => {
    const response = await request.post("/auth/register").send({});
    expect(response.statusCode).toBe(400);
  });

  test("valid info but pass isn't valid", async () => {
    const response = await request.post("/auth/register").send({
      firstname: "test",
      lastname: "test",
      email: "test@gmail.com",
      pasword: "1231",
    });
    expect(response.statusCode).toBe(400);
  });

  test("valid info but email isn't an email", async () => {
    const response = await request.post("/auth/register").send({
      firstname: "test",
      lastname: "test",
      email: "notemail",
      password: "testpass",
    });
    expect(response.statusCode).toBe(400);
  });

  test("valid info but no firstname, lastname", async () => {
    const response = await request.post("/auth/register").send({
      email: "test@gmail.com",
      password: "testpass",
    });
    expect(response.statusCode).toBe(400);
  });
});

describe("creating users and logging in", () => {
  test("created valid user and log in", async () => {
    const createdUser = await request.post("/auth/register").send({
      firstname: "test",
      lastname: "test",
      email: "test@gmail.com",
      password: "testpass",
    });
    const loginResponse = await request.post("/auth/login").send({
      firstname: "test",
      lastname: "test",
      email: "test@gmail.com",
      password: "testpass",
    });
    expect(createdUser.statusCode).toBe(201);
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty("token");
  });

  test("can't create valid user, login with no user", async () => {
    const noCreatedUser = await request.post("/auth/register").send({
      firstname: "test",
      lastname: "test",
      email: "notlegalemail",
      password: "testpass",
    });
    const loginResponse = await request.post("/auth/login").send({
      firstname: "test",
      lastname: "test",
      email: "notlegalemail",
      password: "testpass",
    });
    expect(noCreatedUser.statusCode).toBe(400);
    expect(loginResponse.statusCode).toBe(400);
    expect(loginResponse.body).not.toHaveProperty("token");
  });

  test("created user, logging in with wrong pass", async () => {
    const createdUser = await request.post("/auth/register").send({
      firstname: "test",
      lastname: "test",
      email: "test@gmail.com",
      password: "testpass",
    });

    const loginResponse = await request.post("/auth/login").send({
      firstname: "test",
      lastname: "test",
      email: "test@gmail.com",
      password: "forgotmypassword",
    });
    expect(createdUser.statusCode).toBe(201);
    expect(loginResponse.statusCode).toBe(400);
  });
});
