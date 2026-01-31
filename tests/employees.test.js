import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/db.js";

describe("Employees API", () => {
  // 1. IMPORTANTE: Cerrar conexión al terminar para que el CI no se quede colgado
  afterAll(async () => {
    await pool.end();
  });

  // Test: Obtener todos
  it("should respond with a list of employees", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test: Crear (POST)
  it("should create a new employee", async () => {
    const res = await request(app)
      .post("/api/employees")
      .send({ name: "Testing User", salary: 3000 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  // Test: Obtener uno por ID
  it("should get an employee by id", async () => {
    const res = await request(app).get("/api/employees/1");
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("name");
    } else {
      expect(res.statusCode).toBe(404);
    }
  });

  // Test: EL QUE SUBE LA COBERTURA (404 Not Found)
  it("should return 404 for a non-existing employee", async () => {
    const res = await request(app).get("/api/employees/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Employee not found");
  });

  // Test: EL QUE SUBE LA COBERTURA (PATCH / UPDATE)
  it("should update an employee partially", async () => {
    // Primero creamos uno para asegurar que existe
    const postRes = await request(app)
      .post("/api/employees")
      .send({ name: "Update Me", salary: 1000 });
    
    const id = postRes.body.id;

    const res = await request(app)
      .patch(`/api/employees/${id}`)
      .send({ name: "I am Updated" });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("I am Updated");
  });

  // Test: Borrar (DELETE)
  it("should delete an employee", async () => {
    const postRes = await request(app)
      .post("/api/employees")
      .send({ name: "Delete Me", salary: 500 });
    
    const id = postRes.body.id;
    const res = await request(app).delete(`/api/employees/${id}`);
    expect(res.statusCode).toBe(204);
  });
});
