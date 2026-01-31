import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/db.js";

describe("Employees Routes", () => {
  // Cerramos la conexión a la DB al terminar para evitar el error de "Open Handles"
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
    expect(res.body).toHaveProperty("id");
  });

  it("should get an employee by id", async () => {
    // Primero creamos uno para asegurar que el ID existe
    const result = await request(app)
      .post("/api/employees")
      .send({ name: "Jane Doe", salary: 4000 });
    const id = result.body.id;

    const res = await request(app).get(`/api/employees/${id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Jane Doe");
  });

  it("should return 404 when getting a non-existing employee", async () => {
    const res = await request(app).get("/api/employees/9999");
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Employee not found");
  });

  it("should update an employee", async () => {
    // Creamos uno para actualizarlo
    const result = await request(app)
      .post("/api/employees")
      .send({ name: "Before Update", salary: 1000 });
    const id = result.body.id;

    const res = await request(app)
      .patch(`/api/employees/${id}`)
      .send({ name: "After Update", salary: 5000 });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("After Update");
    expect(res.body.salary).toEqual(5000);
  });

  it("should return 404 when updating a non-existing employee", async () => {
    const res = await request(app)
      .patch("/api/employees/9999")
      .send({ name: "Ghost" });
    expect(res.statusCode).toEqual(404);
  });

  it("should delete an employee by id", async () => {
    const result = await request(app)
      .post("/api/employees")
      .send({ name: "To Delete", salary: 2000 });
    const id = result.body.id;

    const res = await request(app).delete(`/api/employees/${id}`);
    expect(res.statusCode).toEqual(204);
  });

  it("should return 404 when deleting a non-existing employee", async () => {
    const res = await request(app).delete("/api/employees/9999");
    expect(res.statusCode).toEqual(404);
  });
});
