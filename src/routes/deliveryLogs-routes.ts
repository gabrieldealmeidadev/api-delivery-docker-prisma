import { Router } from "express";
import { DeliveriesLogsController } from "@/controllers/deliveryLogs-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { roleVerify } from "@/middlewares/role-verify";

const deliverieslogsRoutes = Router();

const deliveriesLogsController = new DeliveriesLogsController();

deliverieslogsRoutes.get(
  "/:delivery_id/show",
  ensureAuthenticated,
  roleVerify(["sale", "customer"]),
  deliveriesLogsController.show,
);
deliverieslogsRoutes.post(
  "/",
  ensureAuthenticated,
  roleVerify(["sale"]),
  deliveriesLogsController.create,
);

export { deliverieslogsRoutes };
