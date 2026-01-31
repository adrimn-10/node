import request from "supertest";
import app from "../src/app.js"; // Asegúrate de incluir el .js
import { pool } from "../src/db.js"; // Importamos el pool para poder cerrarlo

describe("Index Routes", () => {
  // Cerramos la conexión a la base de datos al terminar
  afterAll(async () => {
    await pool.end();
  });

  it("should respond welcome", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "welcome to my api" });
  });

  it("should respond pong", async () => {
    const res = await request(app).get("/ping");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ result: "pong" });
  });
});
