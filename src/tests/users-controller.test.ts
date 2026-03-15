import request from "supertest";

import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("UsersController", () => {
  let user_id = "";

  // test criar usuário
  it("shold create a new user seccessfully", async () => {
    const response = await request(app).post("/users").send({
      name: " Teste user",
      email: "teste@teste.com.br",
      password: "12345678",
    });

    user_id = response.body.id;

    // expectativa de resposta ao criar o usuario
    expect(response.status).toBe(201);

    // verifica se tem uma propriedade na requisição(se tem o id)
    expect(response.body).toHaveProperty("id");

    //  verifica se name é exatamente o test user
    expect(response.body.name).toBe("Teste user");
  });

  // Testando validação de email duplicado
  it("shold throw an error if with same email already exists", async () => {
    const response = await request(app).post("/users").send({
      name: " duplicated user",
      email: "teste@teste.com.br",
      password: "12345678",
    });
    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      "a user with the same email already exists",
    );
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: user_id } });
  });

  it("shoul throw a validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: " test user",
      email: "invalid-email",
      password: "123456789",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validator error");
  });
});
