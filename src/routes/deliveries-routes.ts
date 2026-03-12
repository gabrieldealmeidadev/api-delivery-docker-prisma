import { Router } from "express";
import { DeliveriesController } from "@/controllers/deliveries-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { roleVerify } from "@/middlewares/role-verify";

const deliveriesRoutes = Router();

const deliveriesController = new DeliveriesController();

deliveriesRoutes.use(ensureAuthenticated, roleVerify(["sale"]));
deliveriesRoutes.get("/", deliveriesController.index);
deliveriesRoutes.post("/", deliveriesController.create);

export { deliveriesRoutes };
