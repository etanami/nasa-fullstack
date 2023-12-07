const request = require("supertest");

const app = require("../../app");

describe("GET /launch", () => {
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
    target: "Kepler-442 e",
  };

  const userDataWithoutDate = {
    mission: "BIG-E Space Entry",
    rocket: "Space Shuttle 1",
    target: "Kepler-442 e",
  };

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

  test("It should catch missing properties", () => {});
  test("It should catch invalid date", () => {});
});
