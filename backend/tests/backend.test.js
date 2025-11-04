const request = require("supertest");
const { app, server } = require("../src/app");

afterAll(() => {
  server.close(); // ✅ closes the Express server after all tests
});

describe("items API", () => {
  let id;

  test("POST /api/items", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ name: "Pen", description: "Blue ink" });
    expect(res.statusCode).toBe(201);
    id = res.body.id;
  });

  test("GET /api/items", async () => {
    const res = await request(app).get("/api/items");
    expect(res.statusCode).toBe(200);
  });

  test("PUT /api/items/:id", async () => {
    const res = await request(app)
      .put(`/api/items/${id}`)
      .send({ name: "Updated Pen" });
    expect(res.statusCode).toBe(200);
  });

  test("DELETE /api/items/:id", async () => {
    const res = await request(app).delete(`/api/items/${id}`);
    expect(res.statusCode).toBe(204);
  });
});
