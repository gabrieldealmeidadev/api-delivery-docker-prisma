import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class DeliveriesLogsController {
  async create(request: Request, response: Response) {
    try {
      const bodySchema = z.object({
        delivery_id: z.string(),
        description: z.string().trim().min(1),
      });

      const { delivery_id, description } = bodySchema.parse(request.body);

      const delivery = await prisma.delivery.findUnique({
        where: { id: delivery_id },
      });

      if (!delivery) {
        throw new AppError("Delivery not found", 404);
      }

      if (delivery.status === "delivered") {
        throw new AppError("this ordem has already been delivered ", 400);
      }

      if (delivery.status === "processing") {
        throw new AppError("Change status to shipped first", 400);
      }

      const log = await prisma.deliveryLog.create({
        data: {
          deliveryId: delivery_id,
          description,
        },
      });

      return response.status(201).json(log);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          message: error.message,
        });
      }

      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: "Validation error",
          issues: error.errors,
        });
      }

      return response.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async show(request: Request, response: Response) {
    try {
      const paramsSchema = z.object({
        delivery_id: z.string().uuid(),
      });

      const { delivery_id } = paramsSchema.parse(request.params);

      const delivery = await prisma.delivery.findUnique({
        where: { id: delivery_id },
        include: {
          logs: true,
        },
      });

      if (
        request.user?.role === "custumer" &&
        request.user.id !== delivery?.userId
      ) {
        throw new AppError("The user can only view their deliveries", 401);
      }

      return response.json(delivery);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          message: error.message,
        });
      }

      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: "Validation error",
          issues: error.errors,
        });
      }

      return response.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export { DeliveriesLogsController };
