const request = require("supertest");

const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launch API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("GET /launch", () => {
    // Test to check for GET request success
    test("It should return with 200 success", async () => {
      const response = await request(app)
        .get("/launch")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /launch", () => {
    const userData = {
      mission: "BIG-E Space Entry",
      rocket: "Space Shuttle 1",
      launchDate: "January 31, 2030",
      target: "Kepler-62 f",
    };

    const userDataWithoutDate = {
      mission: "BIG-E Space Entry",
      rocket: "Space Shuttle 1",
      target: "Kepler-62 f",
    };

    const userDataInvalidDate = {
      mission: "BIG-E Space Entry",
      rocket: "Space Shuttle 1",
      launchDate: "Oops",
      target: "Kepler-62 f",
    };

    // Test to check for POST request success
    test("It should return with 201 success", async () => {
      const response = await request(app)
        .post("/launch")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(userData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(userDataWithoutDate);
    });

    // Test to catch missing properties
    test("It should catch missing properties", async () => {
      const response = await request(app)
        .post("/launch")
        .send(userDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property!",
      });
    });

    // Test to catch invalid date
    test("It should catch invalid date", async () => {
      const response = await request(app)
        .post("/launch")
        .send(userDataInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date!",
      });
    });
  });
});
