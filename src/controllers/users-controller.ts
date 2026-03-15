import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

class UsersController {
  async index(request: Request, response: Response) {
    try {
      const users = await prisma.user.findMany();

      const usersWithoutPassword = users.map(({ password, ...user }) => user);

      return response.status(200).json(usersWithoutPassword);
    } catch (error) {
      return response.status(500).json({ message: "Error Intern server" });
    }
  }

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3),
      email: z.string().email(),
      password: z.string().trim().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userEmailExist = await prisma.user.findFirst({ where: { email } });

    if (userEmailExist) {
      throw new AppError("a user with the same email already exists", 409);
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: string, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  }

  async update(request: Request, response: Response) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(3).optional(),
        email: z.string().email().optional(),
        password: z.string().trim().min(6).optional(),
      });

      const { name, email, password } = bodySchema.parse(request.body);

      const id = request.params.id as string;

      const userExist = await prisma.user.findUnique({
        where: { id },
      });

      if (!userExist) {
        throw new AppError("user not found", 404);
      }

      let hashedPassword;

      if (password) {
        hashedPassword = await hash(password, 8);
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(hashedPassword && { password: hashedPassword }),
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      return response.status(200).json(userWithoutPassword);
    } catch (error) {
      return response.status(500).json({
        message: "error updating user",
        error,
      });
    }
  }

  async remove(request: Request, response: Response) {
    try {
      const id = request.params.id as string;

      const userExist = await prisma.user.findUnique({
        where: { id },
      });

      if (!userExist) {
        throw new AppError("user not found", 404);
      }

      const user = await prisma.user.delete({
        where: { id },
      });

      return response.status(200).json({
        message: "user successfully deleted",
        user,
      });
    } catch (error) {
      return response.status(500).json({
        message: "error deleting user",
        error,
      });
    }
  }
}

export { UsersController };
