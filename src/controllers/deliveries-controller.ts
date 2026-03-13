import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class DeliveriesController {
  async index(request: Request, response: Response) {
    const deliveries = await prisma.delivery.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return response.status(200).json(deliveries);
  }
  async create(request: Request, response: Response) {
    try {
      const bodyShema = z.object({
        user_id: z.string().uuid(),
        description: z.string().trim(),
      });

      const { user_id, description } = bodyShema.parse(request.body);

      const deliveries = await prisma.delivery.create({
        data: {
          userId: user_id,
          description,
        },
      });

      return response.status(201).json("ok create");
    } catch (error) {
      return response.status(500).json({ message: "Error Intern server" });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const bodySchema = z.object({
        status: z.enum(["processing", "shipped", "delivered"]),
      });

      const { id } = paramsSchema.parse(request.params);
      const { status } = bodySchema.parse(request.body);

      await prisma.delivery.update({
        data: {
          status,
        },
        where: {
          id,
        },
      });
      return response
        .status(201)
        .json({ message: "Successfully updated delivery" });
    } catch (error) {
      return response.status(500).json({ message: "Error Intern server" });
    }
  }
}

export { DeliveriesController };
