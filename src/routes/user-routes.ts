import { Router } from "express";
import { UsersController } from "@/controllers/users-controller";

const usersRoutes = Router();
const userController = new UsersController();

usersRoutes.post("/", userController.create);
usersRoutes.get("/", userController.index);
usersRoutes.put("/:id", userController.update);
usersRoutes.delete("/:id", userController.remove);

export { usersRoutes };
