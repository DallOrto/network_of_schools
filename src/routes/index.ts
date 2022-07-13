import { Router } from "express";
import { networkRoutes } from "./network.routes";

const routes = Router();

routes.use("/networks", networkRoutes);

export { routes };