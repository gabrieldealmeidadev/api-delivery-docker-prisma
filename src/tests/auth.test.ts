import request from "supertest";
import { prisma } from "@/database/prisma";

import { app } from "@/app";

describe("UsersController", () => {
  let user_id = "";

  it("shold authenticate a and get access token", async () => {
    const UserResponse = await request(app).post("/users").send({
      name: " Teste user",
      email: "teste@teste.com.br",
      password: "12345678",
    });

    user_id = UserResponse.body.id;

    const AuthResponse = await request(app).post("/auth").send({
      email: "teste@teste.com.br",
      password: "12345678",
    });

    expect(AuthResponse.status).toBe(200);
    expect(AuthResponse.body.token).toEqual(expect.any(String));
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: user_id } });
  });
});
