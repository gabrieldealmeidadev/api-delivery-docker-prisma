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
      const bodySchema = z.object({
        user_id: z.string().uuid(),
        description: z.string().trim(),
      });

      const { user_id, description } = bodySchema.parse(request.body);

      const deliveries = await prisma.delivery.create({
        data: {
          userId: user_id,
          description,
        },
        include: {
          user: {
            select: {
              name: true,
              id: true,
              email: true,
            },
          },
        },
      });

      return response.status(201).json(deliveries);
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

      const deliveryExists = await prisma.delivery.findUnique({
        where: {
          id,
        },
      });

      if (!deliveryExists) {
        throw new AppError("Delivery not found", 404);
      }

      if (deliveryExists.status === status) {
        throw new AppError(`Delivery is already ${status}`, 400);
      }

      if (status === "delivered" && deliveryExists.status !== "shipped") {
        throw new AppError("Delivery must be shipped before delivered", 400);
      }

      const delivery = await prisma.delivery.update({
        where: {
          id,
        },
        data: {
          status,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      await prisma.deliveryLog.create({
        data: {
          deliveryId: id,
          description: status,
        },
      });

      return response.status(200).json({
        message: "Successfully updated delivery",
        delivery,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          message: error.message,
        });
      }

      return response.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export { DeliveriesController };
