import { Router } from "express";
import { networkRoutes } from "./network.routes";
import { schoolRoutes } from "./school.routes";

const routes = Router();

routes.use("/networks", networkRoutes);
routes.use("/schools", schoolRoutes);

export { routes };