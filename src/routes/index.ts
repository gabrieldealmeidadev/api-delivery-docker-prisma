import { Router } from "express";
import { usersRoutes } from "./user-routes";
import { authRoutes } from "./auth-routes";
import { deliveriesRoutes } from "./deliveries-routes";
import { deliverieslogsRoutes } from "./deliveryLogs-routes";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/auth", authRoutes);
routes.use("/deliveries", deliveriesRoutes);
routes.use("/deliverieslogs", deliverieslogsRoutes);

export { routes };
