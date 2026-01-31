import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/db.js";

describe("Employees Routes", () => {
  afterAll(async () => {
    await pool.end();
  });

  it("should respond a list of employees", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new employee", async () => {
    const res = await request(app)
      .post("/api/employees")
      .send({ name: "John Doe", salary: 3000 });
    expect(res.statusCode).toEqual(201);
  });

  it("should return 404 for non-existing employee", async () => {
    const res = await request(app).get("/api/employees/9999");
    expect(res.statusCode).toEqual(404);
  });

  it("should update an employee", async () => {
    const result = await request(app)
      .post("/api/employees")
      .send({ name: "Test", salary: 1000 });
    const id = result.body.id;
    const res = await request(app)
      .patch(`/api/employees/${id}`)
      .send({ name: "Updated" });
    expect(res.statusCode).toEqual(200);
  });
});
